"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
export type LeadFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      error: string;
      fieldErrors?: Record<string, string>;
    };

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;
const MESSAGE_MIN = 10;

function isValidEmail(email: string): boolean {
  if (email.length > EMAIL_MAX) return false;
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return basic.test(email);
}

function normalizeFormContext(raw: string): "home" | "consult" {
  return raw === "consult" ? "consult" : "home";
}

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return {
      status: "error",
      error: "You must be signed in to send a message.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const form_context = normalizeFormContext(
    String(formData.get("form_context") ?? "home").trim(),
  );

  const fieldErrors: Record<string, string> = {};

  if (!name) {
    fieldErrors.name = "Name is required.";
  } else if (name.length > NAME_MAX) {
    fieldErrors.name = `Name must be at most ${NAME_MAX} characters.`;
  }

  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
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

  const { error } = await supabase.from("consult_requests").insert({
    name,
    email,
    message,
    form_context,
  });

  if (error) {
    return {
      status: "error",
      error: "We could not save your request. Please try again shortly.",
    };
  }

  revalidatePath("/");
  revalidatePath("/consult");
  return { status: "success" };
}
