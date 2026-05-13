import Link from "next/link";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppGlyph } from "@/components/marketing/whatsapp-glyph";
import {
  DIGIKON_WHATSAPP_URL,
  INSTAGRAM_PROFILE_URL,
} from "@/lib/marketing-links";
import {
  SITE_PILLARS,
  SITE_TAGLINE,
  SITE_VALUE_LINE,
} from "@/lib/site-brand";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      className="relative px-5 py-20 md:py-28"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Digikon Marketing
        </p>
        <p className="mb-3 text-sm font-medium text-saffron">{SITE_TAGLINE}</p>
        <h1
          id="hero-heading"
          className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
        >
          {SITE_VALUE_LINE}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-muted-foreground md:text-base">
          {SITE_PILLARS}
        </p>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
          From social and SEO to apps, ads, design, video, automation, and QR
          menus — we build digital that performs.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className={cn(
              "bg-saffron text-saffron-foreground shadow hover:bg-saffron/90",
            )}
          >
            <Link href="/consult">Get a free consult</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn(
              "border-saffron text-saffron bg-transparent hover:bg-saffron/10 hover:text-saffron",
            )}
          >
            <Link href="/services">See services</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          No obligation — tell us your goals and we&apos;ll reply within two
          business days.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-saffron hover:bg-saffron/10 hover:text-saffron"
          >
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
              aria-label="Follow Digikon Marketing on Instagram (opens in new tab)"
            >
              <Instagram className="h-4 w-4 shrink-0" aria-hidden />
              Follow us on Instagram
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-saffron hover:bg-saffron/10 hover:text-saffron"
          >
            <a
              href={DIGIKON_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
              aria-label="Message Digikon Marketing on WhatsApp (opens in new tab)"
            >
              <WhatsAppGlyph className="h-4 w-4 shrink-0" />
              Message us on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
