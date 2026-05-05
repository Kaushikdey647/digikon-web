import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/80 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-5 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <p>© Digikon Marketing. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link
            href="/auth/login"
            className="transition-colors hover:text-foreground"
          >
            Client login
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
