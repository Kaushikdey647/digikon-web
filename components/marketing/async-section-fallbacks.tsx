export function ServicesSectionFallback() {
  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-border/80 px-5 py-16 md:py-20"
      aria-busy="true"
      aria-label="Services section loading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto h-28 max-w-2xl animate-pulse rounded-lg bg-muted/50" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-border/60 bg-muted/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSectionFallback() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 border-t border-border/80 px-5 py-16 md:py-20"
      aria-busy="true"
      aria-label="Testimonials loading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto h-28 max-w-2xl animate-pulse rounded-lg bg-muted/50" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <div className="h-56 animate-pulse rounded-xl border border-border/60 bg-muted/30" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
