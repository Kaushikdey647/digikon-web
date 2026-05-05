import {
  BarChart3,
  Megaphone,
  PenLine,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const marketingServices = [
  {
    title: "Search & SEO",
    description:
      "Technical audits, content strategy, and sustainable organic growth.",
    icon: Search,
  },
  {
    title: "Paid media",
    description:
      "Search and social campaigns tuned for CPA, ROAS, and scale.",
    icon: Megaphone,
  },
  {
    title: "Content & creative",
    description:
      "Brand storytelling, landing pages, and assets that convert.",
    icon: PenLine,
  },
  {
    title: "Analytics",
    description:
      "Measurement frameworks, reporting, and insight-led optimization.",
    icon: BarChart3,
  },
] as const;

type ServicesGridProps = {
  consultHref?: string;
};

export function ServicesGrid({ consultHref = "/consult" }: ServicesGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {marketingServices.map(({ title, description, icon: Icon }) => (
        <li key={title}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                <Icon className="h-5 w-5 text-foreground" aria-hidden />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-base">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link
                href={consultHref}
                className="text-sm font-medium text-saffron underline-offset-4 hover:underline"
              >
                Discuss {title.toLowerCase()}
              </Link>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
