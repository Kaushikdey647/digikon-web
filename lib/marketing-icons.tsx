import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Clapperboard,
  Globe2,
  Megaphone,
  Palette,
  PenLine,
  QrCode,
  Search,
  Share2,
  Smartphone,
  Sparkles,
  Star,
  User,
  Users,
  Workflow,
} from "lucide-react";

const marketingIcons = {
  Search,
  Megaphone,
  PenLine,
  BarChart3,
  User,
  Users,
  Building2,
  Sparkles,
  Star,
  Share2,
  Workflow,
  Globe2,
  Palette,
  Clapperboard,
  Smartphone,
  QrCode,
} as const satisfies Record<string, LucideIcon>;

export type MarketingIconKey = keyof typeof marketingIcons;

export function getMarketingIcon(key: string): LucideIcon | null {
  if (key in marketingIcons) {
    return marketingIcons[key as MarketingIconKey];
  }
  return null;
}

export function marketingIconKeys(): MarketingIconKey[] {
  return Object.keys(marketingIcons) as MarketingIconKey[];
}
