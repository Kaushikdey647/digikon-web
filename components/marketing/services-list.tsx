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
    slug: "search-seo",
    title: "Search & SEO",
    description:
      "Technical audits, content strategy, and sustainable organic growth.",
    icon_key: "Search",
  },
  {
    slug: "paid-media",
    title: "Paid media",
    description:
      "Search and social campaigns tuned for CPA, ROAS, and scale.",
    icon_key: "Megaphone",
  },
  {
    slug: "content-creative",
    title: "Content & creative",
    description:
      "Brand storytelling, landing pages, and assets that convert.",
    icon_key: "PenLine",
  },
  {
    slug: "analytics",
    title: "Analytics",
    description:
      "Measurement frameworks, reporting, and insight-led optimization.",
    icon_key: "BarChart3",
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
