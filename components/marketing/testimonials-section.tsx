import { createClient } from "@/lib/supabase/server";
import {
  TestimonialCard,
  type TestimonialRow,
} from "@/components/marketing/testimonial-card";

export type { TestimonialRow } from "@/components/marketing/testimonial-card";

export async function TestimonialsSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, name, icon, rating, message")
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false });

  const testimonials = (data ?? []) as TestimonialRow[];

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
            Recent feedback from teams we&apos;ve partnered with.
          </p>
        </div>
        {testimonials.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Testimonials will appear here once they are added in Supabase.
          </p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.id}>
                <TestimonialCard testimonial={t} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
