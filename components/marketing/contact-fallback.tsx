type ContactFallbackProps = {
  id?: string;
};

export function ContactFallback({ id = "contact" }: ContactFallbackProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-border/80 px-5 py-16 md:py-20"
      aria-busy="true"
      aria-label="Contact form loading"
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-10 h-24 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-80 animate-pulse rounded-xl border border-border/80 bg-muted/30" />
      </div>
    </section>
  );
}
