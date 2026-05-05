import type { Metadata } from "next";
import { ContactFallback } from "@/components/marketing/contact-fallback";
import { ContactSection } from "@/components/marketing/contact-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Free consult | Digikon Marketing",
  description:
    "Book a no-obligation consult with Digikon Marketing. Tell us your goals and we'll reply within two business days.",
};

export default function ConsultPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section
          className="border-b border-border/80 px-5 py-14 md:py-20"
          aria-labelledby="consult-intro-heading"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h1
              id="consult-intro-heading"
              className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Free consult
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              No obligation — share your goals, timeline, and what success looks
              like. We&apos;ll follow up with next steps and whether we&apos;re
              a fit.
            </p>
          </div>
        </section>
        <Suspense fallback={<ContactFallback id="consult" />}>
          <ContactSection
            id="consult"
            heading="Request your consult"
            description="Fill out the form below and we'll get back to you within two business days."
          />
        </Suspense>
      </main>
      <MarketingFooter />
    </div>
  );
}
