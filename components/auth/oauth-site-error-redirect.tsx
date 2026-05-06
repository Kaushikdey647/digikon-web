"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

/**
 * When Supabase OAuth fails before a session exists, it may redirect to the
 * project Site URL (often "/") with ?error= / #error= instead of /auth/callback.
 * Forward those to /auth/error so users see a clear page and the URL is cleaned.
 */
function OAuthSiteErrorRedirectInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (pathname !== "/" || didRedirect.current) return;

    const err = searchParams.get("error");
    const desc = searchParams.get("error_description");
    if (err || desc) {
      didRedirect.current = true;
      const message = desc?.trim() || err || "Authentication failed.";
      router.replace(`/auth/error?error=${encodeURIComponent(message)}`);
      return;
    }

    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace(/^#/, "") ?? "";
    if (!hash.includes("error=")) return;

    const hashParams = new URLSearchParams(hash);
    const hErr = hashParams.get("error");
    const hDesc = hashParams.get("error_description");
    if (hErr || hDesc) {
      didRedirect.current = true;
      const message = hDesc?.trim() || hErr || "Authentication failed.";
      router.replace(`/auth/error?error=${encodeURIComponent(message)}`);
    }
  }, [pathname, router, searchParams]);

  return null;
}

export function OAuthSiteErrorRedirect() {
  return (
    <Suspense fallback={null}>
      <OAuthSiteErrorRedirectInner />
    </Suspense>
  );
}
