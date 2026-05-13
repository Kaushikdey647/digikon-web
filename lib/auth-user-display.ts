import type { User } from "@supabase/supabase-js";

/** Full display name for CRM / consult records from OAuth profile metadata. */
export function fullNameForLead(user: User): string {
  const m = user.user_metadata as Record<string, string | undefined>;
  const full = (m.full_name ?? m.name)?.trim();
  if (full) return full;
  const given = m.given_name?.trim();
  const family = m.family_name?.trim();
  if (given && family) return `${given} ${family}`;
  if (given) return given;
  if (user.email) {
    const local = user.email.split("@")[0]?.trim();
    if (local) return local;
  }
  return "Client";
}
