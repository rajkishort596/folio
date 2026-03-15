"use client";

import { useWorkspace } from "./WorkspaceContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Bot,
  User,
  Paperclip,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { getFileMessages } from "@/lib/actions/dashboard";
import { format } from "date-fns";

interface ChatWrapperProps {
  fileId: string;
  fileName: string;
}

interface ChatMessage extends UIMessage {
  createdAt?: Date | string | number;
}

export function ChatWrapper({ fileId, fileName }: ChatWrapperProps) {
  const { jumpToPage, setSearchQuery } = useWorkspace();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { fileId },
    }),
  });

  useEffect(() => {
    async function fetchMessages() {
      const history = await getFileMessages(fileId);
      const uiMessages: ChatMessage[] = history.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.text,
        createdAt: m.createdAt,
        parts: [{ type: "text" as const, text: m.text }],
      }));
      setMessages(uiMessages as UIMessage[]);
    }
    fetchMessages();
  }, [fileId, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  /**
   * Renders message content. Converts [Page 3: "some text"] patterns into
   * interactive buttons that jump to the PDF page AND trigger scoped
   * text highlighting only inside the PDF container.
   */
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\[?\[(?:Page )?\d+(?::\s*"[\s\S]*?")?\]\]?)/g);
    return parts.map((part, i) => {
      const match = part.match(
        /\[?\[(?:Page )?(\d+)(?::\s*"([\s\S]*?)")?\]\]?/,
      );
      if (match) {
        const pageNum = parseInt(match[1]);
        const highlightText = match[2];
        return (
          <button
            key={i}
            onClick={() => {
              // Set search query BEFORE jumping so the highlight runs
              // after the page renders via onRenderSuccess
              if (highlightText) setSearchQuery(highlightText);
              jumpToPage(pageNum);
            }}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-red-600/10 text-red-600 font-bold hover:bg-red-600/20 transition-all text-xs border border-red-600/20 active:scale-95"
          >
            [Page {pageNum}]
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getMessageText = (message: UIMessage): string =>
    message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="h-14 border-b bg-background/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-red-500/20">
            AI
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight">
              PDF Assistant
            </span>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                Gemini 2.5 Flash • RAG enabled
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-red-600"
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth min-h-0"
      >
        {/* Welcome */}
        <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="size-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-red-500 shrink-0 mt-1 border border-border/50 shadow-sm">
            <Bot className="size-4" />
          </div>
          <div className="space-y-2.5 flex-1">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 rounded-tl-none shadow-sm">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 mb-4 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest leading-tight">
                    {fileName} indexed
                  </p>
                  <p className="text-[10px] text-emerald-600/70 font-medium">
                    Ready for deep analysis
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed font-medium">
                Hey! I've read your PDF and I'm ready to answer any questions.
                What would you like to know?
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic messages */}
        {(messages as ChatMessage[]).map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-4 animate-in fade-in duration-500",
              message.role === "user"
                ? "flex-row-reverse slide-in-from-right-4"
                : "slide-in-from-left-4",
            )}
          >
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm border",
                message.role === "user"
                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                  : "bg-zinc-100 dark:bg-zinc-800 text-red-500 border-border/50",
              )}
            >
              {message.role === "user" ? (
                <User className="size-4" />
              ) : (
                <Bot className="size-4" />
              )}
            </div>
            <div
              className={cn(
                "space-y-2.5 flex-1 flex flex-col",
                message.role === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "rounded-2xl p-4 shadow-sm max-w-[85%]",
                  message.role === "user"
                    ? "bg-red-600 text-white rounded-tr-none shadow-xl shadow-red-500/10"
                    : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-tl-none",
                )}
              >
                <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {renderMessageContent(getMessageText(message))}
                </div>
              </div>
              {message.createdAt && (
                <span
                  className={cn(
                    "text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest",
                    message.role === "user" ? "mr-1 text-right" : "ml-1",
                  )}
                >
                  {format(new Date(message.createdAt), "h:mm a")}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="size-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-red-500 shrink-0 mt-1 border border-border/50 shadow-sm">
              <Bot className="size-4" />
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-zinc-300 animate-bounce" />
              <span
                className="size-1.5 rounded-full bg-zinc-300 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="size-1.5 rounded-full bg-zinc-300 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-6 pt-2 bg-linear-to-t from-background via-background to-transparent shrink-0"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-tr from-red-600/20 to-red-600/5 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-700" />
          <div className="relative bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-2 transition-all group-focus-within:border-red-500/30 shadow-sm group-focus-within:shadow-xl">
            <div className="flex items-end gap-2 px-1">
              {/* <Button type="button" variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground shrink-0 hover:bg-zinc-200/50 dark:hover:bg-zinc-800">
                <Paperclip className="size-5" />
              </Button> */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="Ask a question..."
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-2.5 resize-none font-medium min-h-10 max-h-50"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
                className="size-9 rounded-xl shrink-0 shadow-lg hover:shadow-red-500/20 bg-red-600 hover:bg-red-700 text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-4 ml-0.5" />
              </Button>
            </div>
            <div className="px-3 py-1.5 flex items-center justify-between border-t border-zinc-200/30 dark:border-zinc-800/30 mt-1">
              <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tighter">
                Enter to send • Shift+Enter for new line
              </span>
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-red-600/70 font-black uppercase italic tracking-tighter">
                  Gemini-2.5-Flash
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
