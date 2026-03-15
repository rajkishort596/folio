"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const PdfRenderer = dynamic(() => import("./PdfRenderer").then(mod => mod.PdfRenderer), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
          Initializing PDF Engine...
        </p>
      </div>
    </div>
  )
});
import { ChatWrapper } from "./ChatWrapper";
import { ClientIcon } from "./icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft, Share2 } from "lucide-react";

import { WorkspaceProvider } from "./WorkspaceContext";

interface WorkspaceProps {
  file: {
    id: string;
    name: string;
    url: string;
  };
}

export function Workspace({ file }: WorkspaceProps) {
  return (
    <WorkspaceProvider>
      <div className="flex flex-col h-dvh bg-background overflow-hidden font-geist-sans">
        {/* Workspace Navigation Bar */}
        <header className="h-14 border-b bg-background/50 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
                <ChevronLeft className="size-5" />
              </div>
            </Link>
            <div className="h-4 w-px bg-border/40 mx-1" />
            <div className="flex items-center gap-2 min-w-0">
              <ClientIcon
                name="FileText"
                size={16}
                className="text-red-500/70 shrink-0"
              />
              <h1 className="font-bold text-sm truncate max-w-37.5 md:max-w-md">
                {file.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-red-600"
            >
              <Share2 className="size-4" />
              Share
            </Button> */}
            <div className="h-4 w-px bg-border/40 mx-2" />
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "size-8 rounded-lg border border-border/50 shadow-sm",
                },
              }}
            />
          </div>
        </header>

        {/* Workspace Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0">
          {/* PDF Viewer Side - Hidden on Mobile */}
          <div className="hidden lg:flex flex-1 lg:w-1/2 flex-col min-w-0 border-r border-border/40 overflow-hidden">
            <PdfRenderer url={file.url} />
          </div>

          {/* AI Assistant Side - Always Visible */}
          <div className="flex-1 w-full lg:w-1/2 flex flex-col bg-background lg:shrink-0 z-10 shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.05)] min-h-0">
            <ChatWrapper fileId={file.id} fileName={file.name} />
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
