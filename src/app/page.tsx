"use client";

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
  ClockFadingIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

export default function Chat() {
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("whitespace-pre-wrap text-[15px]")}
                >
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className={cn(
                              message.role === "user"
                                ? "bg-muted/50 px-3.5 py-3 rounded-lg"
                                : "px-1.5 opacity-80"
                            )}
                          >
                            {part.text}
                          </div>
                        );
                      case "reasoning":
                        return (
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
                        );
                    }
                  })}
                </div>
              ))}
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
                          className="w-8 h-8 text-muted-foreground"
                          variant="outline"
                        >
                          <SlidersHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <div className="relative">
                          <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="border-none pl-8 !bg-transparent focus-visible:ring-0"
                            placeholder="Search..."
                          />
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
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
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
