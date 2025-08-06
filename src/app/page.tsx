"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StreamingMarkdown } from "@/components/memoized-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateReasoningTime, cn, countWords } from "@/lib/utils";
import { UIMessageWithMetadata } from "@/types/message";
import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ArtifactRenderer } from "@/components/artifact-parser";
import {
  CheckIcon,
  ChevronDownIcon,
  ClockFadingIcon,
  CopyIcon,
  GlobeIcon,
  LetterTextIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ReactMarkdown from "react-markdown";

const chat = new Chat<UIMessageWithMetadata>({
  transport: new DefaultChatTransport({
    api: "/api/chat",
  }),
});

interface OverflowFile {
  id: string;
  content: string;
  wordCount: number;
  charCount: number;
  createdAt: Date;
}

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4");
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [overflowFiles, setOverflowFiles] = useState<OverflowFile[]>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [reasoningStates, setReasoningStates] = useState<
    Record<string, { isCollapsed: boolean; thinkingTime: number }>
  >({});
  const [currentArtifact, setCurrentArtifact] = useState<any>(null);
  const [showArtifactPanel, setShowArtifactPanel] = useState(false);
  const [chatPanelSize, setChatPanelSize] = useState(100);
  const [artifactPanelSize, setArtifactPanelSize] = useState(50);
  const { messages, sendMessage, status, stop, regenerate } =
    useChat<UIMessageWithMetadata>({
      chat,
      experimental_throttle: 50,
    });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Constants for overflow detection
  const MAX_CHARS = 2000;
  const MAX_WORDS = 400;

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 11);
  };

  const createOverflowFile = (content: string): OverflowFile => {
    return {
      id: generateId(),
      content,
      wordCount: countWords(content),
      charCount: content.length,
      createdAt: new Date(),
    };
  };

  const handleTextOverflow = (
    text: string
  ): { shouldCreateFile: boolean; truncatedText: string } => {
    const wordCount = countWords(text);
    const charCount = text.length;

    if (charCount > MAX_CHARS || wordCount > MAX_WORDS) {
      // Create overflow file with the excess content
      const overflowContent = text;
      const newOverflowFile = createOverflowFile(overflowContent);

      setOverflowFiles((prev) => [...prev, newOverflowFile]);

      // Return empty text to clear the textarea
      return { shouldCreateFile: true, truncatedText: "" };
    }

    return { shouldCreateFile: false, truncatedText: text };
  };

  const removeOverflowFile = (id: string) => {
    setOverflowFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleArtifactDetected = useCallback(() => {
    console.log("Artifact opening tag detected - triggering panel early"); // Debug log
    setShowArtifactPanel(true);
    setChatPanelSize(60); // Resize chat panel immediately when opening tag is detected
  }, []);

  const handlePartialArtifact = useCallback((partialArtifact: any) => {
    console.log("Partial artifact streaming:", partialArtifact); // Debug log
    setCurrentArtifact(partialArtifact);
  }, []);

  const handleArtifactFound = useCallback((artifact: any) => {
    console.log("Artifact found:", artifact); // Debug log
    setCurrentArtifact(artifact);
    // Panel is already open from handleArtifactDetected, just set the final artifact
  }, []);

  const toggleReasoning = (messageId: string, partIndex: number) => {
    const key = `${messageId}-${partIndex}`;
    setReasoningStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isCollapsed: !prev[key]?.isCollapsed,
      },
    }));
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get accurate scrollHeight
      textarea.style.height = "auto";

      // Calculate new height with min/max constraints
      const minHeight = messages.length === 0 ? 120 : 112; // h-32 = 8rem = 128px, h-28 = 7rem = 112px
      const maxHeight = 200; // Maximum height in pixels
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );

      textarea.style.height = `${newHeight}px`;
    }
  }, [textareaValue, messages.length]);

  // Initialize reasoning state without auto-collapse
  useEffect(() => {
    messages.forEach((message) => {
      if (message.role === "assistant") {
        message.parts.forEach((part, partIndex) => {
          if (part.type === "reasoning" && part.state === "done") {
            const key = `${message.id}-${partIndex}`;
            if (!reasoningStates[key]) {
              setReasoningStates((prev) => ({
                ...prev,
                [key]: { isCollapsed: false, thinkingTime: 0 },
              }));
            }
          }
        });
      }
    });
  }, [messages, reasoningStates]);

  useHotkeys(
    "slash",
    () => {
      textareaRef.current?.focus();
    },
    {
      preventDefault: true,
    }
  );

  useHotkeys(
    "enter",
    () => {
      if (textareaValue.trim()) {
        sendMessage(
          {
            text: textareaValue,
          },
          {
            body: {
              selectedModel,
              enabledTools,
            },
          }
        );
        setTextareaValue("");
        setOverflowFiles([]);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "backspace",
    () => {
      if (!textareaValue.trim()) {
        if (overflowFiles.length > 0) {
          setOverflowFiles((prev) => prev.slice(0, -1));
        } else {
          textareaRef.current?.blur();
        }
      }
    },
    {
      preventDefault: false,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "meta+z",
    () => {
      if (overflowFiles.length > 0) {
        setOverflowFiles((prev) => prev.slice(0, -1));
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "esc",
    () => {
      textareaRef.current?.blur();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cn(
        "h-screen w-full",
        !showArtifactPanel && "max-w-screen-md mx-auto border-x border-dashed"
      )}
    >
      {/* Main Chat Panel */}
      <ResizablePanel
        defaultSize={showArtifactPanel ? chatPanelSize : 100}
        minSize={showArtifactPanel ? 40 : 100}
        onResize={setChatPanelSize}
      >
        <main
          className={cn(
            messages.length === 0 ? "pt-10 md:pt-50" : "pt-8",
            messages.length === 0 && "no-overflow",
            "h-full",
            showArtifactPanel ? "px-2" : ""
          )}
        >
          {messages.length === 0 && (
            <div className="text-center">
              <h1 className="text-3xl font-medium tracking-tight font-mono">
                ai playground
              </h1>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Sometimes I run into Claude rate limits. I also wanted to see
                how far I could go with creating custom tools for Claude while
                experimenting with the{" "}
                <Link
                  href="https://sdk.vercel.ai/"
                  target="_blank"
                  className="text-nowrap text-foreground/85 hover:text-foreground transition-colors duration-200"
                >
                  Vercel AI SDK
                </Link>
                .
              </p>
            </div>
          )}
          <div
            className={cn(
              !showArtifactPanel && "max-w-2xl mx-auto",
              "mx-auto px-4",
              messages.length === 0 && "mt-12"
            )}
          >
            {messages.length ? (
              <ScrollArea className="h-[calc(100vh-185px)] overflow-hidden">
                <div className="space-y-3 pb-8">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message, messageIndex) =>
                      message.role === "user" ? (
                        <div key={message.id}>
                          {message.parts.map((part, i) => (
                            <div
                              key={`${message.id}-${i}`}
                              className="bg-muted/50 px-3.5 py-3 rounded-lg text-sm"
                            >
                              {part.type === "text" ? part.text : part.type}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          key={message.id}
                          initial={{
                            opacity: 0,
                            filter: "blur(8px)",
                            y: 20,
                          }}
                          animate={{
                            opacity: 1,
                            filter: "blur(0px)",
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            filter: "blur(4px)",
                            transition: { duration: 0.2 },
                          }}
                          transition={{
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1],
                            delay: messageIndex * 0.1,
                          }}
                        >
                          <AnimatePresence mode="popLayout">
                            {message.parts.map((part, i) => {
                              switch (part.type) {
                                case "text":
                                  return (
                                    <motion.div
                                      key={`${message.id}-${i}`}
                                      className="px-3.5 py-1.5 opacity-80 group"
                                      initial={{
                                        opacity: 0,
                                        filter: "blur(12px)",
                                        y: 5,
                                      }}
                                      animate={{
                                        opacity: 0.8,
                                        filter: "blur(0px)",
                                        y: 0,
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: i * 0.2,
                                      }}
                                    >
                                      <StreamingMarkdown
                                        key={`${message.id}-${i}`}
                                        content={part.text}
                                        onArtifactFound={handleArtifactFound}
                                        onArtifactDetected={
                                          handleArtifactDetected
                                        }
                                        onPartialArtifact={
                                          handlePartialArtifact
                                        }
                                      />
                                      <div
                                        className={cn(
                                          "flex justify-end mt-2 transition-all duration-200 opacity-0",
                                          i === message.parts.length - 1 &&
                                            messageIndex === messages.length - 1
                                            ? "opacity-100"
                                            : "group-hover:opacity-100"
                                        )}
                                      >
                                        <span className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5">
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 w-7"
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(
                                                      part.text
                                                    );
                                                  }}
                                                >
                                                  <CopyIcon className="size-3" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent side="bottom">
                                                Copy
                                              </TooltipContent>
                                            </Tooltip>
                                            <Separator
                                              orientation="vertical"
                                              className="!h-5"
                                            />
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 w-7"
                                                  onClick={() => {
                                                    regenerate({
                                                      headers: {},
                                                      body: {
                                                        selectedModel,
                                                        enabledTools,
                                                      },
                                                    });
                                                  }}
                                                >
                                                  <RotateCcwIcon className="size-3" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent side="bottom">
                                                Regenerate response
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </span>
                                      </div>
                                    </motion.div>
                                  );
                                case "tool-call":
                                  return (
                                    <motion.div
                                      key={`${message.id}-${i}`}
                                      initial={{
                                        opacity: 0,
                                        filter: "blur(6px)",
                                        y: 10,
                                      }}
                                      animate={{
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        y: 0,
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: i * 0.1,
                                      }}
                                      className="mb-3"
                                    >
                                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg text-sm font-medium backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                          {part.toolCallId === "web_search" && (
                                            <div className="p-1 bg-blue-500/20 rounded">
                                              <GlobeIcon className="size-3.5 text-blue-400" />
                                            </div>
                                          )}
                                          <div className="flex flex-col">
                                            <span className="text-blue-400">
                                              {part.toolCallId === "web_search"
                                                ? "Web Search"
                                                : part.toolCallId}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              Running tool...
                                            </span>
                                          </div>
                                        </div>
                                        <div className="ml-2 flex space-x-1">
                                          <div className="w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" />
                                          <div
                                            className="w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
                                            style={{ animationDelay: "0.2s" }}
                                          />
                                          <div
                                            className="w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
                                            style={{ animationDelay: "0.4s" }}
                                          />
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                case "tool-result":
                                  return (
                                    <motion.div
                                      key={`${message.id}-${i}`}
                                      initial={{
                                        opacity: 0,
                                        filter: "blur(6px)",
                                        y: 10,
                                      }}
                                      animate={{
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        y: 0,
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: i * 0.1,
                                      }}
                                      className="mb-3"
                                    >
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="tool-result">
                                          <AccordionTrigger className="text-muted-foreground px-3.5 py-2.5 font-normal text-sm hover:no-underline border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                                            {part.toolCallId === "web_search"
                                              ? "Search Results"
                                              : `${part.toolCallId} Results`}
                                          </AccordionTrigger>
                                          <AccordionContent className="mt-4">
                                            <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-li:text-foreground prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-foreground prose-a:text-blue-500 hover:prose-a:text-blue-400">
                                              <ReactMarkdown>
                                                {typeof part.output === "string"
                                                  ? part.output
                                                  : JSON.stringify(
                                                      part.output,
                                                      null,
                                                      2
                                                    )}
                                              </ReactMarkdown>
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </motion.div>
                                  );
                                case "reasoning": {
                                  const reasoningKey = `${message.id}-${i}`;
                                  const reasoningState =
                                    reasoningStates[reasoningKey];
                                  const isCollapsed =
                                    reasoningState?.isCollapsed ?? false;

                                  return (
                                    <motion.div
                                      key={`${message.id}-${i}`}
                                      initial={{
                                        opacity: 0,
                                        filter: "blur(6px)",
                                        y: 15,
                                      }}
                                      animate={{
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        y: 0,
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: 0.3,
                                      }}
                                      className="mb-2"
                                    >
                                      <Accordion
                                        type="single"
                                        collapsible
                                        value={isCollapsed ? "" : "reasoning"}
                                      >
                                        <AccordionItem
                                          value="reasoning"
                                          className="border-0"
                                        >
                                          <AccordionTrigger
                                            onClick={() =>
                                              toggleReasoning(message.id, i)
                                            }
                                            className="text-muted-foreground px-3.5 py-2.5 font-normal text-sm hover:no-underline border rounded-lg bg-background/50 hover:bg-accent/30 hover:text-accent-foreground !border-dashed transition-all duration-200 [&[data-state=open]]:border-solid [&[data-state=open]]:bg-accent/20"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-2">
                                                <motion.div
                                                  animate={{
                                                    rotate:
                                                      part.state === "done"
                                                        ? 0
                                                        : 360,
                                                    scale:
                                                      part.state === "done"
                                                        ? 1
                                                        : 0.9,
                                                  }}
                                                  transition={{
                                                    duration:
                                                      part.state === "done"
                                                        ? 0.3
                                                        : 2,
                                                    repeat:
                                                      part.state === "done"
                                                        ? 0
                                                        : Infinity,
                                                    ease:
                                                      part.state === "done"
                                                        ? "easeOut"
                                                        : "linear",
                                                  }}
                                                  className={cn(
                                                    "size-1.5 rounded-full bg-emerald-500",
                                                    part.state === "done"
                                                      ? "animate-none"
                                                      : "animate-pulse"
                                                  )}
                                                />
                                                <span className="text-sm">
                                                  {part.state === "done"
                                                    ? "Thought Process"
                                                    : "Thinking..."}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-0.5 text-muted-foreground/60">
                                                <ClockFadingIcon className="size-3" />
                                                {part.state === "done" && (
                                                  <div className="text-xs font-mono">
                                                    {calculateReasoningTime(
                                                      message
                                                    ) ||
                                                      `${Math.round(
                                                        part.text.length / 20
                                                      )}s`}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </AccordionTrigger>
                                          <AccordionContent className="pointer-events-none px-1 py-2.5 bg-input/30 rounded-lg border border-dashed">
                                            <div className="flex gap-2 px-[0.05rem]">
                                              <div className="w-1 h-full bg-accent/50 rounded-full mt-1" />
                                              <StreamingMarkdown
                                                key={`${message.id}-${i}`}
                                                content={part.text}
                                                onArtifactFound={
                                                  handleArtifactFound
                                                }
                                                onArtifactDetected={
                                                  handleArtifactDetected
                                                }
                                                onPartialArtifact={
                                                  handlePartialArtifact
                                                }
                                              />
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </motion.div>
                                  );
                                }
                              }
                            })}
                          </AnimatePresence>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>

                  {/* Streaming indicator */}
                  {status === "submitted" && (
                    <motion.div
                      initial={{ opacity: 0.75, filter: "blur(8px)", y: 20 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0.75, filter: "blur(4px)", y: -10 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="px-3 py-1 text-sm"
                    >
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-muted-foreground text-sm"
                      >
                        Thinking...
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            ) : null}

            <div className="z-50 translate-y-56">
              <div
                className={cn(
                  "relative",
                  showArtifactPanel
                    ? "max-w-none mx-auto px-4"
                    : "max-w-2xl mx-auto"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {overflowFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -5, filter: "blur(2px)" }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="mb-2 pl-2.5 py-2 border rounded-lg bg-input/30 shadow-sm backdrop-blur-sm"
                    >
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence mode="popLayout">
                          {overflowFiles.map((file, index) => (
                            <motion.div
                              key={file.id}
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(4px)",
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              transition={{
                                duration: 0.2,
                                ease: [0.25, 0.1, 0.25, 1],
                                delay: index * 0.05,
                              }}
                              layout
                              className="min-w-0 max-w-36 bg-background border pl-1.5 pr-2 py-1 rounded-lg flex items-center gap-2 group hover:bg-accent/15 transition-all duration-200"
                            >
                              <div className="flex items-center justify-center border p-1 rounded-sm bg-muted/50 shrink-0">
                                <LetterTextIcon className="size-3.5 text-muted-foreground" />
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="text-xs text-muted-foreground font-mono min-w-0 flex-1 cursor-pointer hover:text-foreground transition-colors">
                                    <span className="block truncate">
                                      {file.content.substring(0, 50)}...
                                    </span>
                                    <div className="text-[10px] text-muted-foreground/70">
                                      {file.wordCount} words
                                    </div>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="p-4 w-full !max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="font-medium flex items-center gap-2 pb-2">
                                      Preview of Pasted Content
                                      <div className="flex items-center gap-1.5 border rounded-full px-1.5 py-0.5 shadow-xs">
                                        <span className="text-xs text-muted-foreground/70">
                                          {file.wordCount} words
                                        </span>
                                        <span className="rounded-full bg-foreground/25 w-1 h-1 inline-block" />
                                        <span className="text-xs text-muted-foreground/70">
                                          {file.charCount} chars
                                        </span>
                                      </div>
                                    </DialogTitle>
                                    <DialogDescription className="text-xs h-[75dvh] font-mono overflow-y-auto text-muted-foreground whitespace-pre-wrap">
                                      {file.content}
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                              <button
                                onClick={() => removeOverflowFile(file.id)}
                                className="shrink-0 p-0.5 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-500/10"
                              >
                                <XIcon className="size-3 text-muted-foreground hover:text-red-400 transition-colors" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (textareaValue.trim() || overflowFiles.length > 0) {
                      // Combine current text with overflow files
                      let fullText = textareaValue;
                      if (overflowFiles.length > 0) {
                        const overflowContent = overflowFiles
                          .map((file) => file.content)
                          .join("\n\n");
                        fullText =
                          overflowContent + (fullText ? "\n\n" + fullText : "");
                      }

                      sendMessage(
                        {
                          text: fullText,
                        },
                        {
                          body: {
                            selectedModel,
                            enabledTools,
                          },
                        }
                      );
                      setTextareaValue("");
                      setOverflowFiles([]); // Clear overflow files after sending
                    }
                  }}
                  className="bg-background absolute -top-56 left-0 right-0"
                >
                  <motion.div
                    className="relative"
                    whileHover={{
                      scale: 1.001,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    whileFocus={{
                      scale: 1.002,
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                  >
                    <Textarea
                      placeholder={
                        messages.length === 0
                          ? "What can I do for you today?"
                          : `Reply to ${selectedModel}...`
                      }
                      className="w-full resize-none p-3.5 pr-24 pb-12 overflow-y-auto transition-all duration-200 focus:backdrop-blur-sm border-0 bg-background/95 backdrop-blur-sm"
                      style={{
                        minHeight: messages.length === 0 ? "120px" : "112px",
                        maxHeight: "200px",
                      }}
                      ref={textareaRef}
                      value={textareaValue}
                      onChange={(e) => {
                        const { truncatedText } = handleTextOverflow(
                          e.target.value
                        );
                        setTextareaValue(truncatedText);
                      }}
                    />
                    <div className="absolute top-3 right-4 text-muted-foreground border px-1.5 py-0.5 rounded-sm text-xs bg-secondary/75 backdrop-blur-sm pointer-events-none">
                      <kbd>/</kbd> focus
                    </div>
                  </motion.div>
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="flex justify-between">
                      <div className="flex gap-2 pointer-events-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className={cn(
                                "w-8 h-8 text-muted-foreground relative !bg-background backdrop-blur-sm transition-all duration-200",
                                enabledTools.length > 0 &&
                                  "border !border-blue-500/25 !bg-blue-500/25 text-blue-400 hover:text-blue-300 shadow-blue-500/20 shadow-sm"
                              )}
                              variant="outline"
                            >
                              <SlidersHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent asChild align="start">
                            <Command>
                              <CommandInput
                                placeholder="Search tool..."
                                autoFocus={true}
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No tools found</CommandEmpty>
                                <CommandGroup heading="Available Tools">
                                  <CommandItem
                                    onSelect={() => {
                                      if (enabledTools.includes("reasoning")) {
                                        setEnabledTools(
                                          enabledTools.filter(
                                            (t) => t !== "reasoning"
                                          )
                                        );
                                      } else {
                                        setEnabledTools([
                                          ...enabledTools,
                                          "reasoning",
                                        ]);
                                      }
                                    }}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <ClockFadingIcon className="size-4" />
                                      Reasoning
                                    </div>
                                    <Switch
                                      checked={enabledTools.includes(
                                        "reasoning"
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setEnabledTools([
                                            ...enabledTools,
                                            "reasoning",
                                          ]);
                                        } else {
                                          setEnabledTools(
                                            enabledTools.filter(
                                              (t) => t !== "reasoning"
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </CommandItem>
                                  <CommandItem
                                    onSelect={() => {
                                      if (enabledTools.includes("webSearch")) {
                                        setEnabledTools(
                                          enabledTools.filter(
                                            (t) => t !== "webSearch"
                                          )
                                        );
                                      } else {
                                        setEnabledTools([
                                          ...enabledTools,
                                          "webSearch",
                                        ]);
                                      }
                                    }}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GlobeIcon className="size-4" />
                                      Web Search
                                    </div>
                                    <Switch
                                      checked={enabledTools.includes(
                                        "webSearch"
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setEnabledTools([
                                            ...enabledTools,
                                            "webSearch",
                                          ]);
                                        } else {
                                          setEnabledTools(
                                            enabledTools.filter(
                                              (t) => t !== "webSearch"
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 pointer-events-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="font-normal hover:cursor-pointer !bg-transparent backdrop-blur-sm py-2.5 w-40 px-2 focus-visible:ring-0 hover:!bg-accent/50 hover:border-border !h-6 rounded transition-all duration-200 ease-out justify-between"
                            >
                              {selectedModel === "claude-sonnet-4" &&
                                "Claude Sonnet 4"}
                              {selectedModel === "claude-opus-4" &&
                                "Claude Opus 4"}
                              {selectedModel === "claude-opus-4.1" &&
                                "Claude Opus 4.1"}
                              <motion.div
                                animate={{ rotate: 0 }}
                                whileHover={{ rotate: 180 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }}
                              >
                                <ChevronDownIcon className="size-4 text-muted-foreground/75" />
                              </motion.div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent asChild align="end">
                            <Command>
                              <CommandInput
                                placeholder="Search model..."
                                autoFocus={true}
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No models found</CommandEmpty>
                                <CommandGroup heading="Anthropic">
                                  <CommandItem
                                    onSelect={() =>
                                      setSelectedModel("claude-opus-4.1")
                                    }
                                    className="cursor-pointer justify-between"
                                  >
                                    Claude Opus 4.1
                                    {selectedModel === "claude-opus-4.1" && (
                                      <CheckIcon className="size-4" />
                                    )}
                                  </CommandItem>
                                  <CommandItem
                                    onSelect={() =>
                                      setSelectedModel("claude-opus-4")
                                    }
                                    className="cursor-pointer justify-between"
                                  >
                                    Claude Opus 4
                                    {selectedModel === "claude-opus-4" && (
                                      <CheckIcon className="size-4" />
                                    )}
                                  </CommandItem>
                                  <CommandItem
                                    onSelect={() =>
                                      setSelectedModel("claude-sonnet-4")
                                    }
                                    className="cursor-pointer justify-between"
                                  >
                                    Claude Sonnet 4
                                    {selectedModel === "claude-sonnet-4" && (
                                      <CheckIcon className="size-4" />
                                    )}
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          type="submit"
                          size="icon"
                          className="w-8 h-8 backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                          disabled={
                            status !== "streaming" &&
                            status !== "submitted" &&
                            !textareaValue.trim() &&
                            overflowFiles.length === 0
                          }
                          onClick={(e) => {
                            if (
                              status === "streaming" ||
                              status === "submitted"
                            ) {
                              e.preventDefault();
                              stop();
                            }
                          }}
                        >
                          {status === "streaming" || status === "submitted" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <rect x="4" y="4" width="16" height="16" rx="2" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              version="1.1"
                              fill="currentColor"
                            >
                              <g
                                id="🔍-System-Icons"
                                stroke="none"
                                strokeWidth="1"
                                fill="currentColor"
                                fillRule="evenodd"
                              >
                                <g
                                  id="ic_fluent_arrow_enter_24_filled"
                                  fill="currentColor"
                                  fillRule="nonzero"
                                >
                                  <path
                                    d="M21,4 C21.5128358,4 21.9355072,4.38604019 21.9932723,4.88337887 L22,5 L22,11.5 C22,13.3685634 20.5357224,14.8951264 18.6920352,14.9948211 L18.5,15 L5.415,15 L8.70710678,18.2928932 C9.06759074,18.6533772 9.09532028,19.2206082 8.79029539,19.6128994 L8.70710678,19.7071068 C8.34662282,20.0675907 7.77939176,20.0953203 7.38710056,19.7902954 L7.29289322,19.7071068 L2.29289322,14.7071068 C2.25749917,14.6717127 2.22531295,14.6343256 2.19633458,14.5953066 L2.12467117,14.4840621 L2.12467117,14.4840621 L2.07122549,14.371336 L2.07122549,14.371336 L2.03584514,14.265993 L2.03584514,14.265993 L2.0110178,14.1484669 L2.0110178,14.1484669 L2.00397748,14.0898018 L2.00397748,14.0898018 L2,14 L2.00278786,13.9247615 L2.00278786,13.9247615 L2.02024007,13.7992742 L2.02024007,13.7992742 L2.04973809,13.6878575 L2.04973809,13.6878575 L2.09367336,13.5767785 L2.09367336,13.5767785 L2.14599545,13.4792912 L2.14599545,13.4792912 L2.20970461,13.3871006 L2.20970461,13.3871006 L2.29289322,13.2928932 L2.29289322,13.2928932 L7.29289322,8.29289322 C7.68341751,7.90236893 8.31658249,7.90236893 8.70710678,8.29289322 C9.06759074,8.65337718 9.09532028,9.22060824 8.79029539,9.61289944 L8.70710678,9.70710678 L5.415,13 L18.5,13 C19.2796961,13 19.9204487,12.4051119 19.9931334,11.64446 L20,11.5 L20,5 C20,4.44771525 20.4477153,4 21,4 Z"
                                    id="🎨-Color"
                                  ></path>
                                </g>
                              </g>
                            </svg>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center text-nowrap">
                    <p>
                      LLMs can make mistakes, take their responses with a grain
                      of salt.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </ResizablePanel>

      {/* Artifact Panel */}
      <AnimatePresence mode="popLayout">
        {showArtifactPanel && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={artifactPanelSize}
              minSize={30}
              maxSize={60}
              onResize={setArtifactPanelSize}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  filter: "blur(8px)",
                  x: 100,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(4px)",
                  x: 50,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="h-full bg-background"
              >
                <div className="absolute top-2 right-2 z-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowArtifactPanel(false);
                      setChatPanelSize(100); // Reset chat panel to full width
                    }}
                    className="h-7 w-7 p-0 text-muted-foreground"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="overflow-y-auto">
                  {currentArtifact && (
                    <ArtifactRenderer artifact={currentArtifact} />
                  )}
                  <div className="relative flex h-screen w-full items-center justify-center bg-background">
                    <div
                      className={cn(
                        "absolute inset-0",
                        "[background-size:50px_50px]",
                        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_0px,transparent_1px)]"
                      )}
                    />
                    {/* Radial gradient for the container to give a faded look */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
                  </div>
                </div>
              </motion.div>
            </ResizablePanel>
          </>
        )}
      </AnimatePresence>
    </ResizablePanelGroup>
  );
}
