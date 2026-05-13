import { ThemeSwitcher } from "@/components/theme-switcher";
import { Instagram, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import {
  DIGIKON_PHONE_DISPLAY,
  DIGIKON_PHONE_E164,
  DIGIKON_WHATSAPP_URL,
  INSTAGRAM_PROFILE_URL,
} from "@/lib/marketing-links";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/80 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-5 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <p>© Digikon Marketing. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
          <a
            href={DIGIKON_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            aria-label="Chat on WhatsApp (opens in new tab)"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            WhatsApp
          </a>
          <a
            href={`tel:${DIGIKON_PHONE_E164}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            aria-label={`Call ${DIGIKON_PHONE_DISPLAY}`}
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            {DIGIKON_PHONE_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            aria-label="Follow Digikon Marketing on Instagram (opens in new tab)"
          >
            <Instagram className="h-4 w-4 shrink-0" aria-hidden />
            Instagram
          </a>
          <Link
            href="/auth/login"
            className="transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
