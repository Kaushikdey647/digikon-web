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

const servicesMetaDescription =
  "Digikon Marketing services: social media, content marketing, SEO, automation, website design, graphics, video & photo editing, app development, ads management, and QR / digital menus — strategy through execution.";

export const metadata: Metadata = {
  title: "Services",
  description: servicesMetaDescription,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Digikon Marketing",
    description: servicesMetaDescription,
    url: "/services",
  },
};

async function ServicesGridFromSupabase() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketing_services")
    .select(
      "id, slug, title, description, icon_key, sort_order, home_featured_rank, roadmap_md, sla_md, examples, testimonial_id",
    )
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
              Every offering below has its own roadmap, SLA, examples, and
              consult path. Start anywhere, or book a general consult first.
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
