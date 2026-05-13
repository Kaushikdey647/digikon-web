/**
 * PWA manifest / meta colors aligned with light theme in app/globals.css (:root).
 * HSL approximations: background 42 28% 97%, primary 162 32% 22%.
 */
import { SITE_SEO_DESCRIPTION } from "@/lib/site-brand";

export const pwaTheme = {
  name: "Digikon Marketing",
  shortName: "Digikon",
  description: SITE_SEO_DESCRIPTION,
  backgroundColor: "#F7F4ED",
  themeColor: "#28403A",
} as const;
