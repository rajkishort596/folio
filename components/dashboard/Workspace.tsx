"use client";

import { useState } from "react";
import { PdfRenderer } from "./PdfRenderer";
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
      <div className="flex flex-col h-screen bg-background overflow-hidden font-geist-sans">
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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-red-600"
            >
              <Share2 className="size-4" />
              Share
            </Button>
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
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* PDF Viewer Side - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 md:w-1/2 flex-col min-w-0 border-r border-border/40 overflow-hidden">
            <PdfRenderer url={file.url} />
          </div>

          {/* AI Assistant Side - Always Visible */}
          <div className="w-full md:w-1/2 flex flex-col bg-background shrink-0 z-10 shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.05)]">
            <ChatWrapper fileId={file.id} fileName={file.name} />
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
