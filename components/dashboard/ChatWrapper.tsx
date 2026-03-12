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

/**
 * Custom interface to extend the core UIMessage with optional metadata.
 * AI SDK's UIMessage usually provides id, role, content, parts, etc.
 * We add createdAt to display timestamps for historical messages.
 */
interface ChatMessage extends UIMessage {
  createdAt?: Date | string | number;
}

/**
 * ChatWrapper Component
 * Manages the real-time chat interface for a specific PDF file.
 * Features:
 * - Real-time streaming using AI SDK v6
 * - Message history persistence
 * - Interactive page citations ([Page N]) that jump to specific PDF pages
 * - Smooth auto-scrolling
 */
export function ChatWrapper({ fileId, fileName }: ChatWrapperProps) {
  const { jumpToPage } = useWorkspace(); // Hook from WorkspaceContext to control PDF viewer
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  /**
   * AI SDK v6 useChat initialization.
   * We use the 'transport' option to customize how the hook communicates with our API.
   * This allows us to pass additional body parameters like 'fileId' easily.
   */
  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { fileId }, // Ensure fileId is sent with every request
    }),
  });

  /**
   * Load historical messages from the database on component mount.
   * We need to map the DB message format to the UIMessage format expected by useChat.
   */
  useEffect(() => {
    async function fetchMessages() {
      const history = await getFileMessages(fileId);
      // AI SDK v6 requires 'parts' for messages to display correctly/be processed
      const uiMessages: ChatMessage[] = history.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.text,
        createdAt: m.createdAt,
        // parts allow for multi-modal (text/image) content, we use text type here
        parts: [{ type: "text" as const, text: m.text }],
      }));
      setMessages(uiMessages as UIMessage[]);
    }
    fetchMessages();
  }, [fileId, setMessages]);

  /**
   * Auto-scroll the chat container to the bottom whenever messages change.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handle form submission.
   * In AI SDK v6, 'sendMessage' is the preferred way to trigger a user message.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;
    
    // Send the user input text to the chat API
    sendMessage({ text: input });
    setInput("");
  };

  /**
   * Renders message content and transforms strings like "[Page 3]" into interactive buttons.
   * This enhances the RAG experience by letting users jump straight to sources.
   */
  const renderMessageContent = (text: string) => {
    // Split by page reference patterns
    const parts = text.split(/(\[Page \d+\]|\[\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(?:Page )?(\d+)\]/);
      if (match) {
        const pageNum = parseInt(match[1]);
        return (
          <button
            key={i}
            onClick={() => jumpToPage(pageNum)}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-red-500/10 text-red-600 font-bold hover:bg-red-500/20 transition-colors text-xs"
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  /**
   * Helper to extract the primary text content from a message's parts.
   * AI SDK v6 stores content in the 'parts' array.
   */
  const getMessageText = (message: UIMessage): string =>
    message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");

  /**
   * Status check to determine if the chat is currently waiting for or receiving a response.
   */
  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-full">
      {/* Header with status indicators */}
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

      {/* Messages Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth"
      >
        {/* Static welcome message */}
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

        {/* Dynamic chat messages mapping */}
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
            {/* Avatar block */}
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
            {/* Message bubble block */}
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
                  {/* Custom rendering to handle citations and styling */}
                  {renderMessageContent(getMessageText(message))}
                </div>
              </div>
              {/* Optional timestamp for historical messages */}
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

        {/* Typing indicator — show while submitting or streaming if assistant hasn't replied yet */}
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

      {/* Chat Input Floating Area */}
      <form
        onSubmit={handleSubmit}
        className="p-6 pt-2 bg-linear-to-t from-background via-background to-transparent"
      >
        <div className="relative group">
          {/* Animated glow background on focus */}
          <div className="absolute -inset-1 bg-linear-to-tr from-red-600/20 to-red-600/5 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-700" />
          <div className="relative bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-2 transition-all group-focus-within:border-red-500/30 shadow-sm group-focus-within:shadow-xl">
            <div className="flex items-end gap-2 px-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 rounded-xl text-muted-foreground shrink-0 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
              >
                <Paperclip className="size-5" />
              </Button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // Allow Enter to send, but Shift+Enter for new lines
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
            {/* Input Footer for hints and model info */}
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
