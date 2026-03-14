"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

export function TechStack() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            The Tech Stack
          </h2>
          <h3 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl">
            Powering the Future of PDF Intelligence
          </h3>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We've combined state-of-the-art AI models with robust infrastructure
            to ensure your data is processed with speed, security, and
            precision.
          </p>
        </div>
        <AnimatedGroup
          variants={transitionVariants}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-8"
        >
          {[
            {
              src: "/neon.png",
              alt: "Neon",
              label: "Database",
              invert: true,
            },
            {
              src: "/prisma.svg",
              alt: "Prisma",
              label: "ORM",
              darkInvert: true,
            },
            {
              src: "/vercel.svg",
              alt: "Vercel",
              label: "Deployment",
              darkInvert: true,
            },
            {
              src: "/clerk.png",
              alt: "Clerk",
              label: "Auth",
              darkInvert: true,
            },
            {
              src: "/langchain.png",
              alt: "LangChain",
              label: "AI Framework",
              darkInvert: true,
            },
            {
              src: "/pinecone.svg",
              alt: "Pinecone",
              label: "Vector Search",
              darkInvert: true,
            },
            {
              src: "/gemini.png",
              alt: "Gemini",
              label: "LLM Model",
              darkInvert: true,
            },
            {
              src: "/uploadthing.svg",
              alt: "UploadThing",
              label: "File Storage",
              invert: true,
            },
          ].map((tech, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center justify-center rounded-2xl border bg-card/40 p-4 transition-all duration-500 hover:border-red-500/30 hover:bg-red-500/[0.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.05)] md:p-8"
            >
              <div className="relative h-6 w-full flex items-center justify-center md:h-8">
                <img
                  src={tech.src}
                  alt={tech.alt}
                  className={`h-full max-h-8 w-auto grayscale opacity-40 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 ${
                    tech.invert ? "invert dark:invert-0" : ""
                  } ${tech.darkInvert ? "dark:invert" : ""}`}
                />
              </div>
              <span className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors duration-500 group-hover:text-red-500">
                {tech.label}
              </span>
            </div>
          ))}
        </AnimatedGroup>

        {/* <div className="mt-16 flex justify-center">
          <Link
            href="https://github.com/rajkishort596/folio"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-red-500"
          >
            <span>Learn more about our architecture on GitHub</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}
