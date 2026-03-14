"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="rounded-2xl border bg-card/30 overflow-hidden transition-all duration-300 hover:bg-card/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left cursor-pointer"
      >
        <h4 className="text-lg font-bold pr-8">{q}</h4>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180 text-foreground",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="p-6 pt-0 text-muted-foreground leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
};

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            FAQ
          </h2>
          <h3 className="text-3xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="flex flex-col gap-6">
          {[
            {
              q: "Is my data secure?",
              a: "Yes. We use industry-standard encryption and securely store your PDFs. Nobody else can access your documents.",
            },
            {
              q: "What's the maximum file size?",
              a: "Free users can upload up to 10MB per file. Pro users get up to 50MB per file.",
            },
            {
              q: "How accurate are the answers?",
              a: "Extremely accurate. Our RAG technology grounds every answer precisely in your document's text, reducing hallucinations to near zero.",
            },
            {
              q: "Can I cancel my subscription?",
              a: "Yes, you can cancel your subscription at any time from your account settings.",
            },
          ].map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
