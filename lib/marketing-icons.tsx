import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Megaphone,
  PenLine,
  Search,
  Sparkles,
  Star,
  User,
  Users,
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
