"use client";

import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

const linkClassName =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

function useIsAdminNavVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function refresh() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) {
        if (!cancelled) setVisible(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!cancelled) setVisible(Boolean(data));
    }

    void refresh();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return visible;
}

export function AdminNavLink() {
  const visible = useIsAdminNavVisible();
  if (!visible) return null;

  return (
    <Link href="/admin" className={linkClassName}>
      Admin
    </Link>
  );
}

export function AdminNavMenuItem() {
  const visible = useIsAdminNavVisible();
  if (!visible) return null;

  return (
    <DropdownMenuItem asChild className="md:hidden">
      <Link href="/admin">Admin</Link>
    </DropdownMenuItem>
  );
}
