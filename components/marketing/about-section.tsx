export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border/80 bg-muted/30 px-5 py-16 md:py-20"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 md:items-start">
          <div>
            <h2
              id="about-heading"
              className="text-2xl font-semibold tracking-tight md:text-3xl"
            >
              How we work
            </h2>
            <p className="mt-4 text-muted-foreground">
              Digikon Marketing is a digital marketing agency focused on clarity
              and outcomes. We start with your business goals, map the customer
              journey, then execute with transparent reporting — so you always
              know what shipped and what it drove.
            </p>
          </div>
          <ol className="space-y-6 text-sm">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold">
                1
              </span>
              <div>
                <p className="font-medium text-foreground">Discovery</p>
                <p className="mt-1 text-muted-foreground">
                  Goals, audiences, and channel fit — aligned with leadership.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold">
                2
              </span>
              <div>
                <p className="font-medium text-foreground">Build & launch</p>
                <p className="mt-1 text-muted-foreground">
                  Creative, campaigns, and tracking set up for learning fast.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold">
                3
              </span>
              <div>
                <p className="font-medium text-foreground">Optimize</p>
                <p className="mt-1 text-muted-foreground">
                  Weekly iteration on creative, bids, and landing experiences.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
