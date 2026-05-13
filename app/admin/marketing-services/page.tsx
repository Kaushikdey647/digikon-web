import { Suspense } from "react";
import { AdminMarketingTable } from "@/components/admin/admin-marketing-table";
import type { MarketingServiceRow } from "@/lib/marketing";
import { createClient } from "@/lib/supabase/server";

export default function AdminMarketingServicesPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">Loading marketing services…</p>
      }
    >
      <MarketingServicesContent />
    </Suspense>
  );
}

async function MarketingServicesContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketing_services")
    .select(
      "id, slug, title, description, icon_key, sort_order, home_featured_rank, roadmap_md, sla_md, examples, testimonial_id",
    )
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Marketing Services</h1>
        <p className="mt-2 text-destructive" role="alert">
          Could not load services.
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as MarketingServiceRow[];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Marketing Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit rows below. Save writes changes to Supabase; Discard resets to the last
          loaded state.
        </p>
      </div>
      <AdminMarketingTable initialRows={rows} />
    </div>
  );
}
