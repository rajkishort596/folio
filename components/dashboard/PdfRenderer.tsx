"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { ClientIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./WorkspaceContext";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  RotateCw,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfRendererProps {
  url: string;
}

const resizeObserverOptions = {};

export function PdfRenderer({ url }: PdfRendererProps) {
  const { currentPage, setCurrentPage, currentHighlight } = useWorkspace();
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const isLoading = renderedScale !== scale;

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950/50 flex flex-col items-center h-full">
      {/* Top Controls */}
      <div className="h-12 w-full border-b bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-1.5 md:gap-3">
          <div className="flex items-center bg-background/50 border border-border/40 rounded-lg p-0.5 shadow-sm">
            <Button
              disabled={currentPage <= 1}
              onClick={() =>
                setCurrentPage((prev: number) => (prev - 1 > 1 ? prev - 1 : 1))
              }
              variant="ghost"
              size="icon"
              className="size-8 rounded-sm hover:bg-muted"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="px-3 flex items-center gap-1">
              <input
                className="w-8 h-7 bg-muted/50 border-none rounded text-center text-xs font-bold focus-visible:ring-1 focus-visible:ring-red-500/30"
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= (numPages || 1)) {
                    setCurrentPage(val);
                  }
                }}
              />
              <span className="text-xs font-bold text-muted-foreground/60">
                / {numPages || "--"}
              </span>
            </div>

            <Button
              disabled={
                numPages === undefined || currentPage >= (numPages ?? 0)
              }
              onClick={() =>
                setCurrentPage((prev: number) =>
                  numPages ? (prev + 1 > numPages ? numPages : prev + 1) : 1,
                )
              }
              variant="ghost"
              size="icon"
              className="size-8 rounded-sm hover:bg-muted"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-background/50 border border-border/40 rounded-lg p-0.5 hidden sm:flex shadow-sm">
            <Button
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
              variant="ghost"
              size="icon"
              className="size-8 rounded-sm hover:bg-muted"
            >
              <Minus className="size-4" />
            </Button>
            <div className="px-2 text-[10px] font-black w-12 text-center text-muted-foreground">
              {Math.round(scale * 100)}%
            </div>
            <Button
              onClick={() => setScale((prev) => Math.min(2.5, prev + 0.2))}
              variant="ghost"
              size="icon"
              className="size-8 rounded-sm hover:bg-muted"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

          <Button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-red-600"
          >
            <RotateCw className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-red-600"
          >
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* PDF Main Area */}
      <div
        ref={setContainerRef}
        className="flex-1 w-full overflow-auto scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent"
      >
        <div className="min-h-full p-4 md:p-8 flex justify-center bg-zinc-100/50 dark:bg-zinc-900/30">
          <div className="relative group shadow-2xl shadow-black/10 transition-shadow hover:shadow-red-500/5">
            <Document
              loading={
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <Loader2 className="size-10 text-red-600 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                    Rendering document...
                  </p>
                </div>
              }
              onLoadError={() => {
                console.error("PDF Load Error");
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url}
              className="max-w-full"
            >
              {isLoading && renderedScale ? (
                <Page
                  key={"rendered" + renderedScale}
                  width={containerWidth ? containerWidth * scale : 600}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  customTextRenderer={({ str }) => {
                    if (!currentHighlight || !str.includes(currentHighlight)) {
                      return str;
                    }

                    return str.replace(
                      currentHighlight,
                      `<span class="bg-yellow-200/50 rounded-sm px-0.5">${currentHighlight}</span>`,
                    );
                  }}
                />
              ) : null}

              <Page
                key={"page" + scale}
                className={cn(
                  isLoading ? "hidden" : "animate-in fade-in duration-300",
                )}
                width={containerWidth ? containerWidth * scale : 600}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                onRenderSuccess={() => setRenderedScale(scale)}
                customTextRenderer={({ str }) => {
                  if (!currentHighlight || !str.includes(currentHighlight)) {
                    return str;
                  }

                  return str.replace(
                    currentHighlight,
                    `<span class="bg-yellow-200/50 rounded-sm px-0.5">${currentHighlight}</span>`,
                  );
                }}
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
