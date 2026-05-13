import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Whether the signed-in user has an `admin` row in `user_roles`.
 * Uses the same RLS-visible query as the rest of the app (no service role).
 */
export async function isCurrentUserAdmin(
  supabase: SupabaseClient,
): Promise<boolean> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user?.id) return false;

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
}
