"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/consultation-requests", label: "Consultation Requests" },
  { href: "/admin/marketing-services", label: "Marketing Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-52 shrink-0 border-r border-border/80 bg-muted/20 md:block">
      <nav className="sticky top-16 space-y-1 p-3" aria-label="Admin">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Admin
        </p>
        {items.map(({ href, label }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "block rounded-md bg-background px-2 py-2 text-sm font-medium text-foreground shadow-sm"
                  : "block rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
