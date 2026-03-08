"use client";

import { motion } from "framer-motion";
import { ClientIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import Link from "next/link";

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between gap-4 py-4 border-b border-border/40 mb-12">
      <div className="flex items-center gap-8">
        <Link
          href="/dashboard"
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <Logo />
        </Link>
        <div className="h-6 w-px bg-border/40 hidden md:block" />
        <div className="hidden md:flex flex-col gap-0.5">
          {/* <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight">Dashboard</h1>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-70">
              Personal
            </span>
          </div> */}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* <div className="relative hidden lg:block group">
          <ClientIcon
            name="Search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder="Search documents..."
            className="h-10 w-72 pl-11 pr-4 rounded-xl border border-border/40 bg-muted/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all text-sm font-medium placeholder:text-muted-foreground/40"
          />
        </div> */}

        <div className="flex items-center gap-4 pl-6 border-l border-border/30 h-10">
          <div className="hidden md:flex flex-col items-end gap-0.5">
            <span className="text-sm font-bold leading-none tracking-tight">
              {user?.fullName || "User Account"}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Free Member
              </span>
            </div>
          </div>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "size-10 rounded-xl border border-border/50 shadow-sm transition-transform active:scale-95",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
