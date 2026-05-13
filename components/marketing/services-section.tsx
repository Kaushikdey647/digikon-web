import { ServicesGrid, type MarketingServiceRow } from "@/components/marketing/services-list";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function ServicesSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketing_services")
    .select(
      "id, slug, title, description, icon_key, sort_order, home_featured_rank, roadmap_md, sla_md, examples, testimonial_id",
    )
    .not("home_featured_rank", "is", null)
    .order("home_featured_rank", { ascending: true })
    .limit(4);

  const services = (data ?? []) as MarketingServiceRow[];

  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-border/80 px-5 py-16 md:py-20"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="services-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            What we do
          </h2>
          <p className="mt-3 text-muted-foreground">
            Full-funnel support from first impression to repeat purchase.
          </p>
        </div>
        <div className="mt-12">
          <ServicesGrid services={services} />
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/services"
            className="text-sm font-medium text-saffron underline-offset-4 hover:underline"
          >
            View all services
          </Link>
        </p>
      </div>
    </section>
  );
}
