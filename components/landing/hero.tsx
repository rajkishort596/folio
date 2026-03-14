"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-36">
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,80%,85%,.08)_0,hsla(0,80%,55%,.04)_50%,hsla(0,80%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,80%,85%,.06)_0,hsla(0,80%,45%,.04)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,80%,85%,.04)_0,hsla(0,80%,45%,.03)_80%,transparent_100%)]" />

        {/* New Vibrant Red Flares */}
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
          <AnimatedGroup variants={transitionVariants}>
            <button
              onClick={() => {
                const target = document.getElementById("how-it-works");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="hover:bg-red-500/10 dark:hover:border-t-red-500/20 bg-muted/50 group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950 cursor-pointer"
            >
              <span className="text-foreground text-sm">
                Introducing RAG-Powered PDF Chat
              </span>
              <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

              <div className="bg-background group-hover:bg-red-500/20 size-6 overflow-hidden rounded-full duration-500">
                <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                  <span className="flex size-6">
                    <ArrowRight className="m-auto size-3 text-red-500" />
                  </span>
                  <span className="flex size-6">
                    <ArrowRight className="m-auto size-3 text-red-500" />
                  </span>
                </div>
              </div>
            </button>
          </AnimatedGroup>

          <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h1"
            className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
          >
            Unlocking Knowledge from Your{" "}
            <span className="text-primary bg-clip-text font-bold">PDF</span>{" "}
            Documents
          </TextEffect>
          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.5}
            as="p"
            className="mx-auto mt-8 max-w-2xl text-balance text-lg"
          >
            Chat with your PDFs using Retrieval-Augmented Generation. Get
            instant answers, summaries, and insights from your largest files.
          </TextEffect>

          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
          >
            <div key={1} className="relative group auto-rows-min">
              <div className="absolute -inset-1 bg-linear-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <Button
                asChild
                size="lg"
                className="relative rounded-xl px-8 py-7 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-t border-white/20"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <span className="text-nowrap tracking-tight">
                    Get Started for Free
                  </span>
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </AnimatedGroup>
        </div>
      </div>
    </section>
  );
}
