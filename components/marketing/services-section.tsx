import { ServicesGrid } from "@/components/marketing/services-list";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-border/80 px-5 py-16 md:py-20"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="services-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            What we do
          </h2>
          <p className="mt-3 text-muted-foreground">
            Full-funnel support from first impression to repeat purchase.
          </p>
        </div>
        <div className="mt-12">
          <ServicesGrid />
        </div>
      </div>
    </section>
  );
}
