"use client";

import { MemoizedMarkdown } from "@/components/memoized-markdown";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClockFadingIcon,
  GlobeIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ReactMarkdown from "react-markdown";

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: "/api/chat",
  }),
});

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4");
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [isReasoningEnabled, setIsReasoningEnabled] = useState(false);
  const { messages, sendMessage, status, stop } = useChat({
    chat,
    experimental_throttle: 50,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      if (textareaRef.current?.value.trim()) {
        sendMessage({
          text: textareaRef.current?.value,
        });
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

  return (
    <main className={cn(messages.length === 0 ? "pt-10 md:pt-50" : "pt-8")}>
      {messages.length === 0 && (
        <div>
          <div className="text-center">
            <h1 className="text-3xl font-medium tracking-tight font-mono">
              ai
            </h1>
            <p className=" text-muted-foreground mt-2 max-w-md mx-auto">
              Sometimes I run into Claude rate limits. I also wanted to see how
              far I could go with creating custom tools for Claude, along with
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
        </div>
      )}
      <div
        className={cn("max-w-2xl mx-auto", messages.length === 0 && "mt-12")}
      >
        {messages.length ? (
          <ScrollArea className="h-[calc(100vh-185px)]">
            <div className="space-y-4 pb-8">
              <AnimatePresence mode="popLayout">
                {messages.map((message, messageIndex) =>
                  message.role === "user" ? (
                    <div key={message.id} className={cn("text-[15px]")}>
                      {message.parts.map((part, i) => (
                        <div
                          key={`${message.id}-${i}`}
                          className="bg-muted/50 px-3.5 py-3 rounded-lg"
                        >
                          {part.type === "text" ? part.text : part.type}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      key={message.id}
                      className={cn("text-[15px]")}
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
                                  className="px-3 py-2 opacity-80"
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
                                  <div
                                    className="prose prose-sm max-w-full dark:prose-invert break-words overflow-hidden
    prose-headings:text-foreground prose-headings:scroll-m-20
    prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:lg:text-4xl prose-h1:mt-8 prose-h1:mb-4
    prose-h2:border-b prose-h2:pb-2 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:first:mt-0 prose-h2:mt-8 prose-h2:mb-4
    prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-6 prose-h3:mb-3
    prose-h4:text-lg prose-h4:font-semibold prose-h4:tracking-tight prose-h4:mt-6 prose-h4:mb-3
    prose-p:leading-relaxed prose-p:[&:not(:first-child)]:mt-4 prose-p:mb-4
    prose-p:whitespace-pre-wrap
    prose-strong:font-semibold prose-strong:text-foreground
    prose-blockquote:mt-6 prose-blockquote:mb-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/20 prose-blockquote:py-2
    prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2 prose-ul:[&>li]:mb-1 prose-ul:[&>li]:leading-relaxed
    prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-ol:[&>li]:mt-2 prose-ol:[&>li]:mb-1 prose-ol:[&>li]:leading-relaxed
    prose-li:text-foreground prose-li:marker:text-muted-foreground prose-li:pl-1
    prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-mono prose-code:text-foreground prose-code:break-all
    prose-pre:mb-6 prose-pre:mt-6 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-muted prose-pre:p-4 prose-pre:text-foreground prose-pre:max-w-full prose-pre:border
    prose-table:my-6 prose-table:w-full prose-table:overflow-x-auto prose-table:block prose-table:whitespace-nowrap
    prose-thead:border-b prose-thead:text-left
    prose-th:border prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold prose-th:[&[align=center]]:text-center prose-th:[&[align=right]]:text-right
    prose-td:border prose-td:px-4 prose-td:py-2 prose-td:[&[align=center]]:text-center prose-td:[&[align=right]]:text-right
    prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80 prose-a:break-all
    [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                  >
                                    <MemoizedMarkdown
                                      key={`${message.id}-${i}`}
                                      content={part.text}
                                      id={message.id}
                                    />
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
                            case "reasoning":
                              if (!enabledTools.includes("reasoning")) {
                                return null;
                              }
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
                                >
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value="reasoning">
                                      <AccordionTrigger
                                        className="text-muted-foreground 
                                    px-3.5 py-2.5 font-normal text-sm hover:no-underline border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                                      >
                                        Thought Process
                                      </AccordionTrigger>
                                      <AccordionContent className="mt-4">
                                        {part.text}
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </motion.div>
                              );
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
                  className="px-3 py-2"
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

        <div
          className={cn(
            "absolute bottom-10 w-full left-0 transition-all duration-300 ease-out",
            messages.length === 0 && "bottom-1/3 -translate-y-1/2"
          )}
        >
          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (textareaRef.current?.value.trim()) {
                  sendMessage(
                    {
                      text: textareaRef.current?.value,
                    },
                    {
                      body: {
                        selectedModel,
                        enabledTools,
                      },
                    }
                  );
                  textareaRef.current!.value = "";
                }
              }}
              className="bg-background"
            >
              <Textarea
                placeholder={
                  messages.length === 0
                    ? "What can I do for you today?"
                    : `Reply to ${selectedModel}...`
                }
                className="w-full resize-none h-32 p-3.5 pr-24"
                ref={textareaRef}
              />
              <div className="absolute top-4 right-4 text-muted-foreground border px-1.5 py-0.5 rounded text-xs bg-secondary pointer-events-none">
                <kbd>/</kbd> focus
              </div>
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="flex justify-between">
                  <div className="flex gap-2 pointer-events-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          className={cn(
                            "w-8 h-8 text-muted-foreground relative",
                            enabledTools.length > 0 &&
                              "border !border-blue-500/25 !bg-blue-500/25 text-blue-400"
                          )}
                          variant="outline"
                        >
                          <SlidersHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent asChild>
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
                                  checked={enabledTools.includes("reasoning")}
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
                                  checked={enabledTools.includes("webSearch")}
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
                    {/* <Button
                      type="button"
                      onClick={() => setIsReasoningEnabled(!isReasoningEnabled)}
                      size="icon"
                      className={cn(
                        "w-8 h-8 text-muted-foreground group transition-all duration-200 ease-in-out overflow-hidden",
                        isReasoningEnabled &&
                          "!bg-blue-500/25 !text-blue-400 !border-blue-400/25"
                      )}
                      variant="ghost"
                    >
                      <div className="relative flex items-center justify-center w-full h-full">
                        <ClockFadingIcon
                          className={cn(
                            "transition-all duration-200 ease-in-out",
                            isReasoningEnabled &&
                              "group-hover:opacity-0 group-hover:scale-75"
                          )}
                        />
                        <XIcon
                          className={cn(
                            "absolute transition-all duration-200 ease-in-out opacity-0 scale-75",
                            isReasoningEnabled &&
                              "group-hover:opacity-100 group-hover:scale-100"
                          )}
                        />
                      </div>
                    </Button> */}
                  </div>
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                    >
                      <SelectTrigger className="hover:cursor-pointer !bg-transparent pl-2.5 py-2.5 w-40 border-none focus-visible:ring-0 hover:!bg-black hover:border !h-6 rounded transition-all duration-100 ease-out">
                        <SelectValue placeholder="model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-sonnet-4">
                          Claude Sonnet 4
                        </SelectItem>
                        <SelectItem value="claude-opus-4">
                          Claude Opus 4
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="submit"
                      size="icon"
                      className="w-8 h-8"
                      disabled={
                        status !== "streaming" &&
                        status !== "submitted" &&
                        textareaRef.current?.value.trim().length === 0
                      }
                      onClick={(e) => {
                        if (status === "streaming" || status === "submitted") {
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
                            stroke-width="1"
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
                  LLMs can make mistakes, take their responses with a grain of
                  salt.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
