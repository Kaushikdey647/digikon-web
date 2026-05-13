"use server";

import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import { marketingIconKeys, type MarketingIconKey } from "@/lib/marketing-icons";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const NAME_MAX = 120;
const MESSAGE_MAX = 2000;
const MESSAGE_MIN = 10;

export type InsertTestimonialsResult =
  | { ok: true; inserted: number }
  | { ok: false; error: string };

export type TestimonialDraftInput = {
  name: string;
  icon: string;
  rating: number;
  message: string;
};

function isAllowedIcon(icon: string): icon is MarketingIconKey {
  return (marketingIconKeys() as string[]).includes(icon);
}

function validateDraft(d: TestimonialDraftInput, index: number): string | null {
  const p = `New row ${index + 1}: `;
  const name = d.name.trim();
  if (!name) return `${p}name is required.`;
  if (name.length > NAME_MAX) return `${p}name is too long.`;
  const icon = d.icon.trim();
  if (!icon || !isAllowedIcon(icon)) return `${p}choose a valid icon.`;
  const message = d.message.trim();
  if (!message) return `${p}message is required.`;
  if (message.length < MESSAGE_MIN) return `${p}message is too short.`;
  if (message.length > MESSAGE_MAX) return `${p}message is too long.`;
  if (!Number.isFinite(d.rating) || d.rating < 0 || d.rating > 5) {
    return `${p}rating must be between 0 and 5.`;
  }
  return null;
}

export async function insertTestimonialDrafts(
  drafts: TestimonialDraftInput[],
): Promise<InsertTestimonialsResult> {
  const supabase = await createClient();
  if (!(await isCurrentUserAdmin(supabase))) {
    return { ok: false, error: "Not authorized." };
  }

  if (!Array.isArray(drafts) || drafts.length === 0) {
    return { ok: true, inserted: 0 };
  }

  for (let i = 0; i < drafts.length; i++) {
    const err = validateDraft(drafts[i]!, i);
    if (err) return { ok: false, error: err };
  }

  let inserted = 0;
  for (const d of drafts) {
    const { error } = await supabase.from("testimonials").insert({
      name: d.name.trim(),
      icon: d.icon.trim(),
      rating: d.rating,
      message: d.message.trim(),
    });
    if (error) {
      return { ok: false, error: error.message || "Insert failed." };
    }
    inserted += 1;
  }

  revalidatePath("/");
  revalidatePath("/testimonials/new");
  revalidatePath("/services", "layout");
  return { ok: true, inserted };
}
