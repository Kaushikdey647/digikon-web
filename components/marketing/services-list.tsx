import { Search } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMarketingIcon } from "@/lib/marketing-icons";
import type { MarketingServiceRow } from "@/lib/marketing";

export type { MarketingServiceRow } from "@/lib/marketing";

/** Fallback when the database has no rows yet (e.g. before migration). */
export const defaultMarketingServices: Omit<
  MarketingServiceRow,
  "id" | "sort_order" | "home_featured_rank" | "roadmap_md" | "sla_md" | "examples" | "testimonial_id"
>[] = [
  {
    slug: "social-media-handling",
    title: "Social Media Handling",
    description:
      "Creative calendars, community management, and campaigns that fit your brand voice.",
    icon_key: "Share2",
  },
  {
    slug: "content-marketing",
    title: "Content Marketing",
    description:
      "Story-led blogs, landing copy, and nurture journeys that move people to action.",
    icon_key: "PenLine",
  },
  {
    slug: "seo",
    title: "SEO",
    description:
      "Technical health, topical authority, and sustainable organic visibility.",
    icon_key: "Search",
  },
  {
    slug: "automation",
    title: "Automation",
    description:
      "Workflows, integrations, and lifecycle triggers that save time and lift conversion.",
    icon_key: "Workflow",
  },
  {
    slug: "website-designing",
    title: "Website Designing",
    description:
      "Fast, accessible sites that reflect your brand and support your funnel.",
    icon_key: "Globe2",
  },
  {
    slug: "graphic-designing",
    title: "Graphic Designing",
    description:
      "Brand systems, social kits, decks, and print-ready assets.",
    icon_key: "Palette",
  },
  {
    slug: "video-and-photo-editing",
    title: "Video and Photo Editing",
    description:
      "Cuts, color, motion, and social-first formats for campaigns and launches.",
    icon_key: "Clapperboard",
  },
  {
    slug: "app-development",
    title: "App Development",
    description:
      "Mobile and web apps scoped for usability, performance, and maintainability.",
    icon_key: "Smartphone",
  },
  {
    slug: "ads-management",
    title: "Ads Management",
    description:
      "Paid search, social, and display tuned for CPA, ROAS, and scale.",
    icon_key: "Megaphone",
  },
  {
    slug: "qr-digital-menu-designing",
    title: "QR and Digital Menu Designing",
    description:
      "QR journeys, digital menus, and lightweight experiences guests actually use.",
    icon_key: "QrCode",
  },
];

type ServicesGridProps = {
  services: MarketingServiceRow[];
};

export function ServicesGrid({ services }: ServicesGridProps) {
  const rows: MarketingServiceRow[] =
    services.length > 0
      ? services
      : defaultMarketingServices.map((s, i) => ({
          ...s,
          id: `fallback-${s.slug}`,
          sort_order: (i + 1) * 10,
          home_featured_rank: i + 1,
          roadmap_md: null,
          sla_md: null,
          examples: [],
          testimonial_id: null,
        }));

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {rows.map((row) => {
        const Icon =
          getMarketingIcon(row.icon_key) ??
          Search;
        const detailHref = `/services/${row.slug}`;
        const consultHref = `/consult?service=${encodeURIComponent(row.slug)}`;
        return (
          <li key={row.id}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-5 w-5 text-foreground" aria-hidden />
                </div>
                <CardTitle className="text-lg">
                  <Link
                    href={detailHref}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base">
                  {row.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={detailHref}
                  className="text-sm font-medium text-saffron underline-offset-4 hover:underline"
                >
                  View details
                </Link>
                <span className="hidden text-muted-foreground sm:inline" aria-hidden>
                  ·
                </span>
                <Link
                  href={consultHref}
                  className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Discuss {row.title.toLowerCase()}
                </Link>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
