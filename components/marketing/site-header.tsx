"use client";

import { DigikonLogo } from "@/components/marketing/digikon-logo";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderAuth } from "@/components/marketing/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/testimonials/new", label: "Add testimonial" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground"
          aria-label="Digikon Marketing home"
        >
          <DigikonLogo className="h-8 text-foreground" />
          <span className="text-sm font-semibold tracking-tight">Marketing</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-6">
          <nav
            className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
            aria-label="Main"
          >
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
          <HeaderAuth />
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {nav.map(({ href, label }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href}>{label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
