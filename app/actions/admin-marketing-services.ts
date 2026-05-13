"use server";

import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import { parseServiceExamples } from "@/lib/marketing";
import { marketingIconKeys, type MarketingIconKey } from "@/lib/marketing-icons";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const TITLE_MAX = 300;
const DESC_MAX = 8000;
const MD_MAX = 200_000;

export type AdminMarketingSaveResult =
  | { ok: true }
  | { ok: false; error: string };

export type AdminMarketingRowInput = {
  id: string | null;
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

function isIconKey(v: string): v is MarketingIconKey {
  return (marketingIconKeys() as string[]).includes(v);
}

function validateRow(
  row: AdminMarketingRowInput,
  index: number,
): string | null {
  const prefix = `Row ${index + 1}: `;
  const slug = row.slug.trim();
  if (!slug || !SLUG_RE.test(slug)) {
    return `${prefix}slug must be lowercase letters, numbers, and single hyphens.`;
  }
  const title = row.title.trim();
  if (!title || title.length > TITLE_MAX) {
    return `${prefix}title is required (max ${TITLE_MAX} chars).`;
  }
  const description = row.description.trim();
  if (!description || description.length > DESC_MAX) {
    return `${prefix}description is required (max ${DESC_MAX} chars).`;
  }
  if (!isIconKey(row.icon_key.trim())) {
    return `${prefix}icon_key is not an allowed icon.`;
  }
  if (!Number.isFinite(row.sort_order) || !Number.isInteger(row.sort_order)) {
    return `${prefix}sort_order must be an integer.`;
  }
  const rank = row.home_featured_rank;
  if (rank !== null && rank !== undefined) {
    if (!Number.isInteger(rank) || rank < 1 || rank > 4) {
      return `${prefix}home_featured_rank must be empty or 1–4.`;
    }
  }
  const roadmap = row.roadmap_md?.trim() ?? "";
  const sla = row.sla_md?.trim() ?? "";
  if (roadmap.length > MD_MAX || sla.length > MD_MAX) {
    return `${prefix}markdown fields are too long.`;
  }
  let examplesJson: unknown = row.examples;
  if (typeof examplesJson === "string") {
    try {
      examplesJson = JSON.parse(examplesJson) as unknown;
    } catch {
      return `${prefix}examples must be valid JSON.`;
    }
  }
  const examples = parseServiceExamples(examplesJson);
  if (examples.length === 0 && Array.isArray(examplesJson) && examplesJson.length > 0) {
    return `${prefix}examples must be a JSON array of {title, summary, url?}.`;
  }
  const tid = row.testimonial_id?.trim() ?? "";
  if (tid && !UUID_RE.test(tid)) {
    return `${prefix}testimonial_id must be a valid UUID or empty.`;
  }
  return null;
}

function normalizeRow(row: AdminMarketingRowInput): {
  slug: string;
  title: string;
  description: string;
  icon_key: MarketingIconKey;
  sort_order: number;
  home_featured_rank: number | null;
  roadmap_md: string | null;
  sla_md: string | null;
  examples: ReturnType<typeof parseServiceExamples>;
  testimonial_id: string | null;
} {
  let examplesJson: unknown = row.examples;
  if (typeof examplesJson === "string") {
    examplesJson = JSON.parse(examplesJson) as unknown;
  }
  const examples = parseServiceExamples(examplesJson);
  const rank = row.home_featured_rank;
  const homeRank =
    rank !== null && rank !== undefined && Number.isInteger(rank) && rank >= 1 && rank <= 4
      ? rank
      : null;
  const tid = row.testimonial_id?.trim();
  return {
    slug: row.slug.trim(),
    title: row.title.trim(),
    description: row.description.trim(),
    icon_key: row.icon_key.trim() as MarketingIconKey,
    sort_order: row.sort_order,
    home_featured_rank: homeRank,
    roadmap_md: row.roadmap_md?.trim() || null,
    sla_md: row.sla_md?.trim() || null,
    examples: examples.length > 0 ? examples : [],
    testimonial_id: tid && UUID_RE.test(tid) ? tid : null,
  };
}

export async function saveMarketingServices(
  rows: AdminMarketingRowInput[],
): Promise<AdminMarketingSaveResult> {
  const supabase = await createClient();
  if (!(await isCurrentUserAdmin(supabase))) {
    return { ok: false, error: "Not authorized." };
  }

  if (!Array.isArray(rows)) {
    return { ok: false, error: "Invalid payload." };
  }

  if (rows.length === 0) {
    return { ok: false, error: "Keep at least one marketing service row." };
  }

  for (let i = 0; i < rows.length; i++) {
    const err = validateRow(rows[i]!, i);
    if (err) return { ok: false, error: err };
  }

  const { data: existing, error: listErr } = await supabase
    .from("marketing_services")
    .select("id");

  if (listErr) {
    return { ok: false, error: "Could not load existing services." };
  }

  const existingIds = new Set((existing ?? []).map((r) => r.id as string));
  const payloadIds = new Set(
    rows
      .map((r) => r.id?.trim())
      .filter((id): id is string => Boolean(id && UUID_RE.test(id))),
  );

  for (const id of existingIds) {
    if (!payloadIds.has(id)) {
      const { error: delErr } = await supabase
        .from("marketing_services")
        .delete()
        .eq("id", id);
      if (delErr) {
        return {
          ok: false,
          error: `Could not delete a removed service (${delErr.message}).`,
        };
      }
    }
  }

  for (const row of rows) {
    const rest = normalizeRow(row);

    if (!row.id || !UUID_RE.test(row.id)) {
      const { error: insErr } = await supabase.from("marketing_services").insert({
        slug: rest.slug,
        title: rest.title,
        description: rest.description,
        icon_key: rest.icon_key,
        sort_order: rest.sort_order,
        home_featured_rank: rest.home_featured_rank,
        roadmap_md: rest.roadmap_md,
        sla_md: rest.sla_md,
        examples: rest.examples,
        testimonial_id: rest.testimonial_id,
      });
      if (insErr) {
        return { ok: false, error: insErr.message || "Insert failed." };
      }
    } else {
      const { error: updErr } = await supabase
        .from("marketing_services")
        .update({
          slug: rest.slug,
          title: rest.title,
          description: rest.description,
          icon_key: rest.icon_key,
          sort_order: rest.sort_order,
          home_featured_rank: rest.home_featured_rank,
          roadmap_md: rest.roadmap_md,
          sla_md: rest.sla_md,
          examples: rest.examples,
          testimonial_id: rest.testimonial_id,
        })
        .eq("id", row.id);
      if (updErr) {
        return { ok: false, error: updErr.message || "Update failed." };
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/consult");
  revalidatePath("/services", "layout");
  return { ok: true };
}
