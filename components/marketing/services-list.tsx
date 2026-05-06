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

export type MarketingServiceRow = {
  id: string;
  title: string;
  description: string;
  icon_key: string;
  sort_order: number;
};

/** Fallback when the database has no rows yet (e.g. before migration). */
export const defaultMarketingServices: Omit<
  MarketingServiceRow,
  "id" | "sort_order"
>[] = [
  {
    title: "Search & SEO",
    description:
      "Technical audits, content strategy, and sustainable organic growth.",
    icon_key: "Search",
  },
  {
    title: "Paid media",
    description:
      "Search and social campaigns tuned for CPA, ROAS, and scale.",
    icon_key: "Megaphone",
  },
  {
    title: "Content & creative",
    description:
      "Brand storytelling, landing pages, and assets that convert.",
    icon_key: "PenLine",
  },
  {
    title: "Analytics",
    description:
      "Measurement frameworks, reporting, and insight-led optimization.",
    icon_key: "BarChart3",
  },
];

type ServicesGridProps = {
  services: MarketingServiceRow[];
  consultHref?: string;
};

export function ServicesGrid({
  services,
  consultHref = "/consult",
}: ServicesGridProps) {
  const rows =
    services.length > 0
      ? services
      : defaultMarketingServices.map((s, i) => ({
          ...s,
          id: `fallback-${s.title}`,
          sort_order: i * 10,
        }));

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {rows.map((row) => {
        const Icon =
          getMarketingIcon(row.icon_key) ??
          Search;
        return (
          <li key={row.id}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-5 w-5 text-foreground" aria-hidden />
                </div>
                <CardTitle className="text-lg">{row.title}</CardTitle>
                <CardDescription className="text-base">
                  {row.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  href={consultHref}
                  className="text-sm font-medium text-saffron underline-offset-4 hover:underline"
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
