"use server";

import { createClient } from "@/lib/supabase/server";
import { marketingIconKeys, type MarketingIconKey } from "@/lib/marketing-icons";
import { revalidatePath } from "next/cache";

export type TestimonialFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      error: string;
      fieldErrors?: Record<string, string>;
    };

const NAME_MAX = 120;
const MESSAGE_MAX = 2000;
const MESSAGE_MIN = 10;

function isAllowedIcon(icon: string): icon is MarketingIconKey {
  return (marketingIconKeys() as string[]).includes(icon);
}

export async function submitTestimonial(
  _prev: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getClaims();
  if (authError || !data?.claims?.sub) {
    return {
      status: "error",
      error: "You must be signed in to add a testimonial.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const rating = Number.parseFloat(ratingRaw);

  const fieldErrors: Record<string, string> = {};

  if (!name) {
    fieldErrors.name = "Name is required.";
  } else if (name.length > NAME_MAX) {
    fieldErrors.name = `Name must be at most ${NAME_MAX} characters.`;
  }

  if (!icon || !isAllowedIcon(icon)) {
    fieldErrors.icon = "Choose a valid icon.";
  }

  if (!Number.isFinite(rating)) {
    fieldErrors.rating = "Rating is required.";
  } else if (rating < 0 || rating > 5) {
    fieldErrors.rating = "Rating must be between 0 and 5.";
  }

  if (!message) {
    fieldErrors.message = "Message is required.";
  } else if (message.length < MESSAGE_MIN) {
    fieldErrors.message = `Message must be at least ${MESSAGE_MIN} characters.`;
  } else if (message.length > MESSAGE_MAX) {
    fieldErrors.message = `Message must be at most ${MESSAGE_MAX} characters.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  const { error: insertError } = await supabase.from("testimonials").insert({
    name,
    icon,
    rating,
    message,
  });

  if (insertError) {
    return {
      status: "error",
      error: "Could not save your testimonial. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/testimonials/new");
  return { status: "success" };
}
