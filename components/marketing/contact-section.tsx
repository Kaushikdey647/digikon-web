import { LeadForm } from "@/components/marketing/lead-form";

type ContactSectionProps = {
  id?: string;
  heading?: string;
  description?: string;
  formContext?: "home" | "consult";
};

export function ContactSection({
  id = "contact",
  heading = "Get in touch",
  description = "Ready to grow? Send a note and we'll schedule a short intro call.",
  formContext = "home",
}: ContactSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-border/80 px-5 py-16 md:py-20"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <h2
            id={headingId}
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {heading}
          </h2>
          <p className="mt-3 text-muted-foreground">{description}</p>
        </div>
        <LeadForm formContext={formContext} />
      </div>
    </section>
  );
}
