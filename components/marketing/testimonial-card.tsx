import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getMarketingIcon } from "@/lib/marketing-icons";
import { Quote, Star } from "lucide-react";

export type TestimonialRow = {
  id: string;
  name: string;
  icon: string;
  rating: number;
  message: string;
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = Math.max(0, Math.min(1, rating - full));
  const empty = 5 - full - (partial > 0 ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: full }, (_, i) => (
        <Star
          key={`f-${i}`}
          className="h-4 w-4 fill-saffron text-saffron"
          aria-hidden
        />
      ))}
      {partial > 0 ? (
        <span className="relative h-4 w-4" aria-hidden>
          <Star className="absolute h-4 w-4 text-muted-foreground/40" />
          <span
            className="absolute overflow-hidden"
            style={{ width: `${partial * 100}%` }}
          >
            <Star className="h-4 w-4 fill-saffron text-saffron" />
          </span>
        </span>
      ) : null}
      {Array.from({ length: empty }, (_, i) => (
        <Star
          key={`e-${i}`}
          className="h-4 w-4 text-muted-foreground/40"
          aria-hidden
        />
      ))}
      <span className="ml-2 text-xs font-medium tabular-nums text-muted-foreground">
        {rating.toFixed(1)}/5
      </span>
    </div>
  );
}

type TestimonialCardProps = {
  testimonial: TestimonialRow;
  className?: string;
};

export function TestimonialCard({ testimonial: t, className }: TestimonialCardProps) {
  const PersonIcon = getMarketingIcon(t.icon);
  return (
    <Card
      className={`h-full border-l-2 border-l-saffron/80 shadow-sm transition-shadow hover:shadow-md ${className ?? ""}`}
    >
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <Quote
            className="h-5 w-5 shrink-0 text-saffron"
            aria-hidden
            strokeWidth={2}
          />
          {PersonIcon ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-muted/50">
              <PersonIcon className="h-4 w-4 text-foreground" aria-hidden />
            </div>
          ) : null}
        </div>
        <StarRating rating={t.rating} />
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <figure>
          <blockquote className="text-sm leading-relaxed text-muted-foreground">
            <p>&ldquo;{t.message}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-4 border-t border-border/60 pt-4 text-sm font-medium text-foreground">
            {t.name}
          </figcaption>
        </figure>
      </CardContent>
    </Card>
  );
}
