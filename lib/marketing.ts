import { createClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "@/components/marketing/testimonial-card";

export type MarketingServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_key: string;
  sort_order: number;
  home_featured_rank: number | null;
  roadmap_md: string | null;
  sla_md: string | null;
  examples: unknown;
  testimonial_id: string | null;
};

export type ServiceExample = {
  title: string;
  summary: string;
  url?: string;
};

export type MarketingServiceWithTestimonial = MarketingServiceRow & {
  testimonial: TestimonialRow | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseServiceExamples(raw: unknown): ServiceExample[] {
  if (!Array.isArray(raw)) return [];
  const out: ServiceExample[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const summary = typeof item.summary === "string" ? item.summary.trim() : "";
    if (!title || !summary) continue;
    const url = typeof item.url === "string" ? item.url.trim() : undefined;
    out.push({ title, summary, ...(url ? { url } : {}) });
  }
  return out;
}

export async function getServiceBySlug(
  slug: string,
): Promise<MarketingServiceWithTestimonial | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("marketing_services")
    .select(
      "id, slug, title, description, icon_key, sort_order, home_featured_rank, roadmap_md, sla_md, examples, testimonial_id",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !row) return null;

  const service = row as MarketingServiceRow;

  let testimonial: TestimonialRow | null = null;
  if (service.testimonial_id) {
    const { data: t } = await supabase
      .from("testimonials")
      .select("id, name, icon, rating, message")
      .eq("id", service.testimonial_id)
      .maybeSingle();
    if (t) testimonial = t as TestimonialRow;
  }

  return { ...service, testimonial };
}
