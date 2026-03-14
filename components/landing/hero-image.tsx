"use client";

import React from "react";
import Image from "next/image";
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

export function HeroImage() {
  return (
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
      <div className="mask-b-from-55% relative mt-8 overflow-hidden px-4 sm:mt-12 md:mt-20">
        <div className="inset-shadow-2xs ring-background dark:inset-shadow-red-500/10 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-red-500/20 p-2 shadow-lg shadow-red-950/5 ring-1 md:p-4">
          <Image
            className="bg-background aspect-15/8 relative hidden w-full rounded-2xl dark:block"
            src="/folio-dark.png"
            alt="app screen"
            width="2700"
            height="1440"
            priority
          />
          <Image
            className="z-2 border-border/25 aspect-15/8 relative w-full rounded-2xl border dark:hidden"
            src="/folio-light.png"
            alt="app screen"
            width="2700"
            height="1440"
            priority
          />
        </div>
      </div>
    </AnimatedGroup>
  );
}
