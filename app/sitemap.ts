import { getSiteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/consult`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("marketing_services")
    .select("slug, created_at")
    .order("sort_order", { ascending: true });

  const serviceEntries: MetadataRoute.Sitemap = (rows ?? []).map(
    (row: { slug: string; created_at?: string | null }) => ({
      url: `${base}/services/${row.slug}`,
      lastModified: row.created_at ? new Date(row.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  return [...staticEntries, ...serviceEntries];
}
