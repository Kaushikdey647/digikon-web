"use server";

/**
 * Lead capture action. Replace the log below with a Supabase insert, email
 * provider (e.g. Resend), or CRM webhook when ready for production persistence.
 */
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

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

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

  const emailDomain =
    email.includes("@") ? email.split("@").pop()?.slice(0, 64) : undefined;

  console.info("[lead] new submission", {
    nameLength: name.length,
    emailDomain: emailDomain ?? "unknown",
    messageLength: message.length,
  });

  return { status: "success" };
}
