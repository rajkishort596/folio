"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
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
  X,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfRendererProps {
  url: string;
}

// A highlight mark we inject into the PDF text layer DOM
const HIGHLIGHT_TAG = "pdf-highlight-mark";
const HIGHLIGHT_CLASS = "pdf-text-highlight";
const HIGHLIGHT_ACTIVE_CLASS = "pdf-text-highlight--active";

const resizeObserverOptions = {};

export function PdfRenderer({ url }: PdfRendererProps) {
  const { currentPage, setCurrentPage, searchQuery, setSearchQuery } =
    useWorkspace();

  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [matchCount, setMatchCount] = useState(0);

  // This ref points to the div that wraps the <Document> — our search scope.
  // We ONLY search inside this element, so the chat UI is never touched.
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    const [entry] = entries;
    if (entry) setContainerWidth(entry.contentRect.width);
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);
  const isLoading = renderedScale !== scale;

  // ─── How the highlighting works ──────────────────────────────────────────
  //
  // react-pdf renders each page as:
  //   <canvas>  ← the visual PDF rendering
  //   <div class="react-pdf__Page__textLayer">
  //     <span>word </span><span>word </span> ...  ← real DOM text nodes
  //   </div>
  //
  // We use the browser's Range API scoped to pdfContainerRef to:
  //   1. Walk ALL text nodes inside the PDF container using TreeWalker
  //   2. Build one long combined string from them
  //   3. Find where our query appears in that string
  //   4. Use document.createRange() to select exactly those characters
  //   5. Use range.surroundContents() to wrap them in a <pdf-highlight-mark>
  //
  // Because we use pdfContainerRef as the TreeWalker root, we NEVER touch
  // the chat UI or any other part of the page — it's 100% scoped.
  //
  // ─────────────────────────────────────────────────────────────────────────

  const clearHighlights = useCallback(() => {
    if (!pdfContainerRef.current) return;

    // Find all our injected mark elements and unwrap them back to plain text
    const marks = pdfContainerRef.current.querySelectorAll(HIGHLIGHT_TAG);
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      // Move all children out of the mark back into the parent
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
      // Merge split text nodes back together
      parent.normalize();
    });

    setMatchCount(0);
  }, []);

  const applyHighlights = useCallback(
    (query: string) => {
      if (!pdfContainerRef.current || !query.trim()) return;

      // Step 1: collect all text nodes INSIDE the PDF container only
      const walker = document.createTreeWalker(
        pdfContainerRef.current,   // ← ROOT: only the PDF div, not the whole page
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            // Skip empty text nodes
            if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
            // Skip text inside our own highlight marks (prevent double-wrapping)
            if ((node.parentElement as Element)?.tagName?.toLowerCase() === HIGHLIGHT_TAG) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      // Step 2: build combined text + map each character back to its text node
      const textNodes: Text[] = [];
      let combinedText = "";
      let node: Node | null;

      while ((node = walker.nextNode())) {
        textNodes.push(node as Text);
        combinedText += node.nodeValue;
      }

      if (!combinedText) return;

      // Step 3: find all occurrences of query (case-insensitive)
      // Build flexible regex to handle PDF whitespace variations
      const escapedQuery = query
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "[\\s\\u00A0]+");

      let regex: RegExp;
      try {
        regex = new RegExp(escapedQuery, "gi");
      } catch {
        return;
      }

      // Step 4: for each match, find the exact text node(s) it spans
      // and use Range API to wrap it in a <pdf-highlight-mark>
      const matches: { startNode: Text; startOffset: number; endNode: Text; endOffset: number }[] = [];
      let match: RegExpExecArray | null;

      while ((match = regex.exec(combinedText)) !== null) {
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        let charPos = 0;
        let startNode: Text | null = null;
        let startOffset = 0;
        let endNode: Text | null = null;
        let endOffset = 0;

        for (const textNode of textNodes) {
          const nodeLen = textNode.nodeValue?.length ?? 0;
          const nodeStart = charPos;
          const nodeEnd = charPos + nodeLen;

          if (!startNode && matchStart < nodeEnd && matchStart >= nodeStart) {
            startNode = textNode;
            startOffset = matchStart - nodeStart;
          }

          if (startNode && matchEnd <= nodeEnd) {
            endNode = textNode;
            endOffset = matchEnd - nodeStart;
            break;
          }

          charPos = nodeEnd;
        }

        if (startNode && endNode) {
          matches.push({ startNode, startOffset, endNode, endOffset });
        }
      }

      if (matches.length === 0) {
        // Fuzzy fallback: try shorter prefix of query (first 5 words)
        const shortQuery = query.split(" ").slice(0, 5).join(" ");
        if (shortQuery !== query) {
          applyHighlights(shortQuery);
        }
        return;
      }

      // Step 5: wrap each match in a custom element
      // We go in REVERSE order so earlier ranges aren't invalidated by DOM mutations
      let highlightCount = 0;
      [...matches].reverse().forEach((m, i) => {
        try {
          const range = document.createRange();
          range.setStart(m.startNode, m.startOffset);
          range.setEnd(m.endNode, m.endOffset);

          const mark = document.createElement(HIGHLIGHT_TAG);
          mark.className =
            i === matches.length - 1 // first match (reversed) = active
              ? `${HIGHLIGHT_CLASS} ${HIGHLIGHT_ACTIVE_CLASS}`
              : HIGHLIGHT_CLASS;

          range.surroundContents(mark);
          highlightCount++;

          // Scroll first match into view
          if (i === matches.length - 1) {
            mark.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } catch {
          // surroundContents throws if range crosses element boundaries —
          // this happens at span edges in the PDF text layer.
          // We skip those edge cases silently.
        }
      });

      setMatchCount(highlightCount);
    },
    [],
  );

  // ─── React to searchQuery or page change ─────────────────────────────────
  useEffect(() => {
    if (!searchQuery) {
      clearHighlights();
      return;
    }
    // Small delay: let react-pdf finish rendering the text layer DOM
    // before we walk it. 200ms is enough even on slow machines.
    const timer = setTimeout(() => {
      clearHighlights();   // clear old highlights first
      applyHighlights(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, renderedScale, clearHighlights, applyHighlights]);

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950/50 flex flex-col items-center h-full">

      {/* Toolbar */}
      <div className="h-12 w-full border-b bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-1.5 md:gap-3">
          <div className="flex items-center bg-background/50 border border-border/40 rounded-lg p-0.5 shadow-sm">
            <Button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
              variant="ghost" size="icon" className="size-8 rounded-sm hover:bg-muted"
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
              disabled={numPages === undefined || currentPage >= numPages}
              onClick={() => setCurrentPage((prev: number) => numPages ? Math.min(numPages, prev + 1) : 1)}
              variant="ghost" size="icon" className="size-8 rounded-sm hover:bg-muted"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active search pill */}
          {searchQuery && (
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1">
              <span className="text-[10px] font-bold text-amber-600 max-w-32 truncate">
                {searchQuery}
              </span>
              {matchCount > 0 && (
                <span className="text-[10px] font-black text-amber-500/70">
                  {matchCount} match{matchCount !== 1 ? "es" : ""}
                </span>
              )}
              <button
                onClick={() => {
                  clearHighlights();
                  setSearchQuery("");
                }}
                className="text-amber-500/60 hover:text-amber-600 transition-colors"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {/* Zoom */}
          <div className="items-center bg-background/50 border border-border/40 rounded-lg p-0.5 hidden sm:flex shadow-sm">
            <Button
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
              variant="ghost" size="icon" className="size-8 rounded-sm hover:bg-muted"
            >
              <Minus className="size-4" />
            </Button>
            <div className="px-2 text-[10px] font-black w-12 text-center text-muted-foreground">
              {Math.round(scale * 100)}%
            </div>
            <Button
              onClick={() => setScale((prev) => Math.min(2.5, prev + 0.2))}
              variant="ghost" size="icon" className="size-8 rounded-sm hover:bg-muted"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

          <Button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            variant="ghost" size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-red-600"
          >
            <RotateCw className="size-4" />
          </Button>

          {/* <Button
            variant="ghost" size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-red-600"
          >
            <Maximize2 className="size-4" />
          </Button> */}
        </div>
      </div>

      {/* PDF Area */}
      <div
        ref={setContainerRef}
        className="flex-1 w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent"
      >
        <div className="min-h-full p-4 md:p-8 flex justify-center bg-zinc-100/50 dark:bg-zinc-900/30">
          {/*
            ↓ THIS is pdfContainerRef — the TreeWalker root.
            Only text inside this div is ever searched. The chat UI is
            outside this div so it is NEVER touched by our highlighting.
          */}
          <div
            ref={pdfContainerRef}
            className="relative shadow-2xl shadow-black/10 transition-shadow hover:shadow-red-500/5"
          >
            <Document
              loading={
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <Loader2 className="size-10 text-red-600 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                    Rendering document...
                  </p>
                </div>
              }
              onLoadError={() => console.error("PDF Load Error")}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url}
              className="max-w-full"
            >
              {/* Ghost page during scale transitions */}
              {isLoading && renderedScale ? (
                <Page
                  key={"ghost-" + renderedScale}
                  width={containerWidth ? containerWidth * scale : 600}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  className="opacity-50"
                />
              ) : null}

              <Page
                key={"page-" + scale + "-" + currentPage}
                className={cn(
                  isLoading && renderedScale
                    ? "invisible absolute top-0 left-0"
                    : "animate-in fade-in duration-300",
                )}
                width={containerWidth ? containerWidth * scale : 600}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                onRenderSuccess={() => {
                  setRenderedScale(scale);
                  // Text layer was just rebuilt — re-apply highlights
                  if (searchQuery) {
                    setTimeout(() => {
                      clearHighlights();
                      applyHighlights(searchQuery);
                    }, 200);
                  }
                }}
              />
            </Document>
          </div>
        </div>
      </div>

      {/* Scoped highlight styles — only apply inside pdf-container */}
      <style dangerouslySetInnerHTML={{
        __html: `
          ${HIGHLIGHT_TAG}.${HIGHLIGHT_CLASS} {
            display: inline;
            background-color: rgba(234, 179, 8, 0.45);
            border-radius: 2px;
            box-shadow: 0 0 0 1px rgba(234, 179, 8, 0.6);
            animation: pdf-hl-in 0.25s ease-out forwards;
          }
          ${HIGHLIGHT_TAG}.${HIGHLIGHT_ACTIVE_CLASS} {
            background-color: rgba(234, 88, 12, 0.5);
            box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.8);
          }
          .dark ${HIGHLIGHT_TAG}.${HIGHLIGHT_CLASS} {
            background-color: rgba(250, 204, 21, 0.35);
            mix-blend-mode: color-dodge;
          }
          .dark ${HIGHLIGHT_TAG}.${HIGHLIGHT_ACTIVE_CLASS} {
            background-color: rgba(251, 146, 60, 0.45);
          }
          @keyframes pdf-hl-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `,
      }} />
    </div>
  );
}