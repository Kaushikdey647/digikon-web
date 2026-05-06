"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function displayFirstName(user: User): string {
  const m = user.user_metadata as Record<string, string | undefined>;
  if (m.given_name?.trim()) return m.given_name.trim();
  const full = (m.full_name ?? m.name)?.trim();
  if (full) return full.split(/\s+/)[0] ?? "Account";
  if (user.email) return user.email.split("@")[0] ?? "Account";
  return "Account";
}

function avatarUrl(user: User): string | undefined {
  const m = user.user_metadata as { avatar_url?: string };
  return typeof m.avatar_url === "string" ? m.avatar_url : undefined;
}

const loginClassName =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function HeaderAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    void supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setUser(data.user ?? null);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }, [router]);

  if (loading) {
    return (
      <span
        className="inline-block h-8 w-24 shrink-0 animate-pulse rounded-md bg-muted/60"
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <Link href="/auth/login" className={loginClassName}>
        Client login
      </Link>
    );
  }

  const name = displayFirstName(user);
  const src = avatarUrl(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-9 max-w-[200px] gap-2 px-2"
          aria-label={`Account menu for ${name}`}
        >
          {src ? (
            <img
              src={src}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase">
              {name.slice(0, 1)}
            </span>
          )}
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground md:inline">
            {name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/testimonials/new">Add testimonial</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void signOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
