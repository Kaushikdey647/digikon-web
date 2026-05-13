import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SiteHeader } from "@/components/marketing/site-header";
import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="p-6 text-sm text-muted-foreground">Loading admin…</div>
        </div>
      }
    >
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </Suspense>
  );
}

async function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  if (!(await isCurrentUserAdmin(supabase))) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AdminMobileNav />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <AdminSidebar />
        <div className="min-h-0 flex-1 overflow-hidden p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
