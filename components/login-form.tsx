"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const handleGoogle = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const origin = getSiteUrl();
    if (!origin) {
      setError("Missing NEXT_PUBLIC_SITE_URL or browser origin.");
      setIsLoading(false);
      return;
    }

    const safeNext =
      next.startsWith("/") && !next.startsWith("//") ? next : "/";

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsLoading(false);
      return;
    }

    if (data.url) {
      window.location.assign(data.url);
    } else {
      setError("Could not start Google sign-in.");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>
            Sign in with Google to submit a testimonial, send a consult request, or
            use admin tools if your account has access.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button
            type="button"
            className="w-full"
            disabled={isLoading}
            onClick={() => void handleGoogle()}
          >
            {isLoading ? "Redirecting…" : "Continue with Google"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="underline underline-offset-4">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
