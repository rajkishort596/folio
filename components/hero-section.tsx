import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";

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

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
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
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32"
            >
              <Image
                src="/night-background.jpg"
                alt="background"
                className="hidden size-full dark:block"
                width="3276"
                height="4095"
              />
            </AnimatedGroup>

            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="hover:bg-red-500/10 dark:hover:border-t-red-500/20 bg-muted/50 group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
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
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Unlocking Knowledge from Your{" "}
                  <span className="text-primary bg-clip-text font-bold">
                    PDF
                  </span>{" "}
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
                  instant answers, summaries, and insights from your largest
                  files.
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
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="#link">
                        <span className="text-nowrap">Upload PDF</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="secondary"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

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
            >
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-red-500/10 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-red-500/20 p-4 shadow-lg shadow-red-950/5 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="/folio-light.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="/folio-light.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="relative overflow-hidden border-t bg-background py-24 md:py-32">
          {/* Subtle top edge glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

          {/* Ambient background flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[400px] w-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)]" />

          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                The Tech Stack
              </h2>
              <h3 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl">
                Powering the Future of PDF Intelligence
              </h3>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                We've combined state-of-the-art AI models with robust
                infrastructure to ensure your data is processed with speed,
                security, and precision.
              </p>
            </div>

            <AnimatedGroup
              variants={transitionVariants}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8"
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
                  className="group relative flex flex-col items-center justify-center rounded-2xl border bg-card/40 p-8 transition-all duration-500 hover:border-red-500/30 hover:bg-red-500/[0.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.05)]"
                >
                  <div className="relative h-8 w-full flex items-center justify-center">
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

            <div className="mt-16 flex justify-center">
              <Link
                href="/"
                className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-red-500"
              >
                <span>Learn more about our architecture</span>
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
