"use client";

import { usePathname, useRouter } from "next/navigation";

const options = [
  { href: "/admin/consultation-requests", label: "Consultation Requests" },
  { href: "/admin/marketing-services", label: "Marketing Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
] as const;

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const current =
    options.find((o) => pathname === o.href || pathname.startsWith(`${o.href}/`))
      ?.href ?? options[0].href;

  return (
    <div className="border-b border-border/80 p-3 md:hidden">
      <label htmlFor="admin-section" className="sr-only">
        Admin section
      </label>
      <select
        id="admin-section"
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={current}
        onChange={(e) => {
          router.push(e.target.value);
        }}
      >
        {options.map(({ href, label }) => (
          <option key={href} value={href}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
