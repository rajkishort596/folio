"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

const menuItems = [
  { name: "How it works", href: "how-it-works" },
  { name: "Features", href: "features" },
  { name: "Pricing", href: "pricing" },
  { name: "FAQ", href: "faq" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between items-center lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <div className="flex items-center gap-2 lg:hidden">
                <ThemeToggle />
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-1 block cursor-pointer p-2.5"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const target = document.getElementById(item.href);
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150 cursor-pointer"
                    >
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full rounded-3xl border p-8 shadow-2xl shadow-zinc-300/20 lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden w-full mb-8">
                <ul className="space-y-6 text-center text-lg font-medium">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setMenuState(false);
                          const target = document.getElementById(item.href);
                          if (target) {
                            setTimeout(() => {
                              target.scrollIntoView({ behavior: "smooth" });
                            }, 100); // small delay to allow menu animation to close
                          }
                        }}
                        className="text-muted-foreground hover:text-foreground block transition-colors duration-200 cursor-pointer"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row lg:gap-6">
                <div className="flex w-full flex-col items-center gap-6 lg:w-auto lg:flex-row">
                  <Show when="signed-out">
                    <SignInButton>
                      <Link
                        href="/sign-in"
                        className="w-full max-w-[150px] lg:w-auto"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full lg:w-auto",
                            isScrolled && "lg:hidden",
                          )}
                        >
                          Login
                        </Button>
                      </Link>
                    </SignInButton>
                    <SignUpButton>
                      <Link
                        href="/sign-up"
                        className="w-full max-w-[150px] lg:w-auto"
                      >
                        <Button
                          size="sm"
                          className={cn(
                            "w-full lg:w-auto",
                            isScrolled && "lg:hidden",
                          )}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>

                <div className="hidden lg:block border-l pl-4 dark:border-zinc-800">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
