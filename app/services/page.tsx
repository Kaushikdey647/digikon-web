import type { Metadata } from "next";
import Link from "next/link";
import { ServicesSectionFallback } from "@/components/marketing/async-section-fallbacks";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import {
  ServicesGrid,
  type MarketingServiceRow,
} from "@/components/marketing/services-list";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Services | Digikon Marketing",
  description:
    "SEO, paid media, content, and analytics — full-funnel digital marketing from Digikon Marketing.",
};

async function ServicesGridFromSupabase() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketing_services")
    .select("id, title, description, icon_key, sort_order")
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as MarketingServiceRow[];

  return <ServicesGrid services={services} />;
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-5 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Services
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Full-funnel support from first impression to repeat purchase.
              Start with a free consult to align on priorities and scope.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/consult">Request a free consult</Link>
              </Button>
            </div>
          </div>
          <div className="mt-14">
            <Suspense fallback={<ServicesSectionFallback />}>
              <ServicesGridFromSupabase />
            </Suspense>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
