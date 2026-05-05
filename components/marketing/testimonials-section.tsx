import { Quote } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Testimonial = {
  name: string;
  company?: string;
  role?: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Alex Rivera",
    role: "CMO",
    company: "Northline Retail Co.",
    quote:
      "Digikon tightened our paid search and reporting in weeks. We finally see which campaigns actually move revenue, not just clicks.",
  },
  {
    name: "Sam Okonkwo",
    company: "Brightfield SaaS",
    quote:
      "Clear communication and fast iteration. Our landing tests went from idea to live without the usual agency drag.",
  },
  {
    name: "Jordan Lee",
    role: "Founder",
    company: "Harbor & Co.",
    quote:
      "They treated our budget like their own. SEO and content finally tell one story — our pipeline noticed.",
  },
  {
    name: "Priya Desai",
    role: "Marketing Director",
    company: "Vertex Logistics",
    quote:
      "The team made analytics approachable for leadership. We review one concise dashboard and know what to do next.",
  },
];

function AttributionLine({ name, role, company }: Testimonial) {
  if (role && company) {
    return (
      <>
        {name}, {role} · {company}
      </>
    );
  }
  if (company) {
    return (
      <>
        {name} · {company}
      </>
    );
  }
  if (role) {
    return (
      <>
        {name} · {role}
      </>
    );
  }
  return <>{name}</>;
}

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 border-t border-border/80 px-5 py-16 md:py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            What clients say
          </h2>
          <p className="mt-3 text-muted-foreground">
            A few teams we&apos;ve partnered with — replace with your real client
            names and quotes anytime.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={`${t.name}-${t.company ?? "solo"}`}>
              <Card className="h-full border-l-2 border-l-saffron/80 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <Quote
                    className="h-5 w-5 text-saffron"
                    aria-hidden
                    strokeWidth={2}
                  />
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <figure>
                    <blockquote className="text-sm leading-relaxed text-muted-foreground">
                      <p>&ldquo;{t.quote}&rdquo;</p>
                    </blockquote>
                    <figcaption className="mt-4 border-t border-border/60 pt-4 text-sm font-medium text-foreground">
                      <AttributionLine {...t} />
                    </figcaption>
                  </figure>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
