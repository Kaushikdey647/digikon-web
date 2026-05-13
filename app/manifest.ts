import type { MetadataRoute } from "next";
import { pwaTheme } from "@/lib/pwa-theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: pwaTheme.name,
    short_name: pwaTheme.shortName,
    description: pwaTheme.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: pwaTheme.backgroundColor,
    theme_color: pwaTheme.themeColor,
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
