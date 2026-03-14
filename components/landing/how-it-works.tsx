"use client";

import React from "react";
import { Upload, Sparkles, MessageSquare } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.03)_0%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            The Process
          </h2>
          <h3 className="text-4xl font-bold tracking-tight md:text-6xl">
            Ready in Three Simple Steps
          </h3>
        </div>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            },
            item: {
              hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  bounce: 0.2,
                  duration: 1.2,
                },
              },
            },
          }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {[
            {
              icon: <Upload className="size-8 text-red-500" />,
              title: "Upload Documents",
              description:
                "Simply drag and drop your PDF files. We handle everything from single-page docs to massive reports with ease.",
              step: "01",
            },
            {
              icon: <Sparkles className="size-8 text-red-500" />,
              title: "AI Processing",
              description:
                "Our RAG-powered engine securely indexes your content, creating a searchable map of knowledge just for you.",
              step: "02",
            },
            {
              icon: <MessageSquare className="size-8 text-red-500" />,
              title: "Chat & Discover",
              description:
                "Ask questions in plain English. Get instant, accurate answers with direct citations from your own files.",
              step: "03",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-start rounded-3xl border bg-card/30 p-8 transition-all duration-500 hover:border-red-500/20 hover:bg-red-500/[0.01]"
            >
              <div className="absolute top-8 right-8 text-5xl font-black text-foreground/5 transition-colors group-hover:text-red-500/5">
                {item.step}
              </div>
              <div className="mb-6 rounded-2xl bg-red-500/10 p-4 shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-shadow group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                {item.icon}
              </div>
              <h4 className="mb-3 text-xl font-bold">{item.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {/* Subtle accent line */}
              <div className="mt-8 h-1 w-12 rounded-full bg-red-500/20 transition-all duration-500 group-hover:w-full group-hover:bg-red-500/40" />
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
