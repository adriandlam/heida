"use client";

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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import {
  ChevronDownIcon,
  ClockFadingIcon,
  GlobeIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [isReasoningEnabled, setIsReasoningEnabled] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat();

  return (
    <main className={cn(messages.length === 0 ? "pt-10 md:pt-64" : "pt-8")}>
      {messages.length === 0 && (
        <div>
          <div className="text-center">
            <h1 className="text-4xl font-medium tracking-tight">Adrian's AI</h1>
            <p className=" text-muted-foreground mt-2">
              This project was made because sometimes I run into Claude rate
              limits.
            </p>
          </div>
        </div>
      )}
      <div
        className={cn("max-w-2xl mx-auto", messages.length === 0 && "mt-12")}
      >
        {messages.length ? (
          <ScrollArea className="h-[calc(100vh-185px)]">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message, messageIndex) =>
                  message.role === "user" ? (
                    <div
                      key={message.id}
                      className={cn("whitespace-pre-wrap text-[15px]")}
                    >
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
                      className={cn("whitespace-pre-wrap text-[15px]")}
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
                                  className="px-1.5 opacity-80"
                                  initial={{
                                    opacity: 0,
                                    filter: "blur(12px)",
                                    y: 10,
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
                                  <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-li:text-foreground prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-foreground prose-a:text-blue-500 hover:prose-a:text-blue-400">
                                    <ReactMarkdown
                                      components={{
                                        p: ({ children }) => (
                                          <p className="my-3 leading-normal">
                                            {children}
                                          </p>
                                        ),
                                        ol: ({ children }) => (
                                          <ol className="list-decimal pl-6 my-3 space-y-1">
                                            {children}
                                          </ol>
                                        ),
                                        ul: ({ children }) => (
                                          <ul className="list-disc pl-6 my-3 space-y-1">
                                            {children}
                                          </ul>
                                        ),
                                        li: ({ children }) => (
                                          <li className="leading-normal">
                                            {children}
                                          </li>
                                        ),
                                        code: ({
                                          node,
                                          inline,
                                          className,
                                          children,
                                          ...props
                                        }) => {
                                          if (inline) {
                                            return (
                                              <code
                                                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                                                {...props}
                                              >
                                                {children}
                                              </code>
                                            );
                                          }
                                          return (
                                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                                              <code
                                                className="font-mono text-sm"
                                                {...props}
                                              >
                                                {children}
                                              </code>
                                            </pre>
                                          );
                                        },
                                      }}
                                    >
                                      {part.text}
                                    </ReactMarkdown>
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
                                      {part.toolCallId === "webSearch" && (
                                        <div className="p-1 bg-blue-500/20 rounded">
                                          <GlobeIcon className="size-3.5 text-blue-400" />
                                        </div>
                                      )}
                                      <div className="flex flex-col">
                                        <span className="text-blue-400">
                                          {part.toolCallId === "webSearch"
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
                                        {part.toolCallId === "webSearch" ? "Search Results" : `${part.toolCallId} Results`}
                                      </AccordionTrigger>
                                      <AccordionContent className="mt-4">
                                        <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-li:text-foreground prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-foreground prose-a:text-blue-500 hover:prose-a:text-blue-400">
                                          <ReactMarkdown>
                                            {typeof part.output === 'string' 
                                              ? part.output 
                                              : JSON.stringify(part.output, null, 2)}
                                          </ReactMarkdown>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </motion.div>
                              );
                            case "reasoning":
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
                  initial={{ opacity: 0.5, filter: "blur(8px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0.5, filter: "blur(4px)", y: -10 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="px-1.5"
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
            "absolute bottom-6 w-full left-0 transition-all duration-300 ease-out",
            messages.length === 0 && "bottom-1/3 -translate-y-1/2"
          )}
        >
          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage(
                    {
                      text: input,
                    },
                    {
                      body: {
                        isReasoningEnabled,
                        enabledTools,
                      },
                    }
                  );
                  setInput("");
                }
              }}
              className="bg-background"
            >
              <Textarea
                placeholder={
                  messages.length === 0 ? "How can I help you?" : "Reply..."
                }
                className="w-full resize-none h-32 p-3.5 pr-12 "
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
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
                    <Button
                      onClick={() => setIsReasoningEnabled(!isReasoningEnabled)}
                      size="icon"
                      className={cn(
                        "w-8 h-8 text-muted-foreground group transition-all duration-200 ease-in-out overflow-hidden",
                        isReasoningEnabled &&
                          "!bg-blue-500/25 !text-blue-400 !border-blue-400/25"
                      )}
                      variant="outline"
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
                    </Button>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      size="icon"
                      className="w-8 h-8"
                      disabled={
                        status !== "streaming" &&
                        status !== "submitted" &&
                        input.trim().length === 0
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
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
