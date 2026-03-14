import React from "react";
import { Zap, CheckCircle2, Bot } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Features
          </h2>
          <h3 className="text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to master your documents
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Lightning Fast Search",
              description:
                "Find exactly what you are looking for instantly across thousands of pages using semantic vector search.",
              icon: <Zap className="size-6 text-red-500" />,
            },
            {
              title: "Accurate Citations",
              description:
                "Every answer comes with precise page numbers. Click to jump straight to the source material.",
              icon: <CheckCircle2 className="size-6 text-red-500" />,
            },
            {
              title: "Secure Storage",
              description:
                "Your documents are securely hosted and processed. Only you have access to your private files.",
              icon: <Bot className="size-6 text-red-500" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-8 rounded-3xl border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
