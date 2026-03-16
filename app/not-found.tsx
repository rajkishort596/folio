"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FileQuestion, MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="size-32 md:size-40 bg-card border border-border/50 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10">
            <FileQuestion className="size-16 md:size-20 text-primary animate-pulse" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl md:text-8xl font-black tracking-tighter bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent mb-6"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
        >
          Page not found
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-muted-foreground text-lg md:text-xl font-medium mb-12 max-w-md mx-auto"
        >
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </motion.div>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto overflow-hidden rounded-2xl"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-card border border-border/50 hover:border-border text-foreground font-bold flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all w-full"
            >
              <MoveLeft size={20} />
              <span>Go Back</span>
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
