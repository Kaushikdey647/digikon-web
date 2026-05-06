import { ServicesGrid, type MarketingServiceRow } from "@/components/marketing/services-list";
import { createClient } from "@/lib/supabase/server";

export async function ServicesSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketing_services")
    .select("id, title, description, icon_key, sort_order")
    .order("sort_order", { ascending: true });

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
      </div>
    </section>
  );
}
