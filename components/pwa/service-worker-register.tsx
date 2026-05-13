"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    const hostname = window.location.hostname;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local");
    const isProd = process.env.NODE_ENV === "production";
    if (!isProd && !isLocal) return;

    void navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        /* ignore registration errors (unsupported, blocked, etc.) */
      });
  }, []);

  return null;
}
