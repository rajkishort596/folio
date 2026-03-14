import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 md:py-32 bg-muted/30 border-y border-border/50"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Pricing
          </h2>
          <h3 className="text-4xl font-bold tracking-tight md:text-5xl">
            Simple, transparent pricing
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col gap-6 p-8 rounded-3xl border bg-card/50">
            <div>
              <h4 className="text-2xl font-bold">Free Plan</h4>
              <div className="mt-4 text-muted-foreground">
                Perfect for trying things out
              </div>
            </div>
            <div className="text-4xl font-bold">
              $0
              <span className="text-lg text-muted-foreground font-normal">
                /mo
              </span>
            </div>
            <ul className="space-y-4 flex-1">
              {[
                "3 PDFs per month",
                "Up to 50 pages each",
                "Basic chat support",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-red-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4" variant="outline">
              Current Plan
            </Button>
          </div>

          <div className="flex flex-col gap-6 p-8 rounded-3xl border-2 border-red-500/50 bg-card relative shadow-2xl shadow-red-500/10">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-red-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">
              Popular
            </div>
            <div>
              <h4 className="text-2xl font-bold">Pro Plan</h4>
              <div className="mt-4 text-muted-foreground">
                For power users and researchers
              </div>
            </div>
            <div className="text-4xl font-bold">
              $19
              <span className="text-lg text-muted-foreground font-normal">
                /mo
              </span>
            </div>
            <ul className="space-y-4 flex-1">
              {[
                "Unlimited PDFs",
                "Up to 1000 pages each",
                "Priority support",
                "Early access to features",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-red-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
