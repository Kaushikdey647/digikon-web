import type { Metadata } from "next";
import { ContactFallback } from "@/components/marketing/contact-fallback";
import { ContactSection } from "@/components/marketing/contact-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getServiceBySlug } from "@/lib/marketing";
import {
  DIGIKON_PHONE_DISPLAY,
  DIGIKON_WHATSAPP_URL,
  INSTAGRAM_PROFILE_URL,
} from "@/lib/marketing-links";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Free consult",
  description:
    "Book a no-obligation consult with Digikon Marketing, or WhatsApp +91 91018 01200 for a quick question. We reply within two business days to form requests.",
  alternates: { canonical: "/consult" },
  openGraph: {
    title: "Free consult | Digikon Marketing",
    description:
      "Book a no-obligation consult with Digikon Marketing, or WhatsApp +91 91018 01200 for a quick question. We reply within two business days to form requests.",
    url: "/consult",
  },
};

type ConsultPageProps = {
  searchParams: Promise<{ service?: string }>;
};

function ConsultPageFallback() {
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
              Loading…
            </p>
          </div>
        </section>
        <ContactFallback id="consult" />
      </main>
      <MarketingFooter />
    </div>
  );
}

async function ConsultPageContent({ searchParams }: ConsultPageProps) {
  const { service: serviceSlug } = await searchParams;
  const trimmed = serviceSlug?.trim() ?? "";
  const serviceFromQuery =
    trimmed.length > 0 ? await getServiceBySlug(trimmed) : null;

  const marketingServiceId = serviceFromQuery?.id ?? null;
  const loginNext =
    serviceFromQuery && trimmed.length > 0
      ? `/consult?service=${encodeURIComponent(trimmed)}`
      : "/consult";

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
              like. We&apos;ll follow up with next steps and whether we&apos;re a
              fit. You can also reach us on{" "}
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-saffron underline-offset-4 hover:underline"
              >
                Instagram
              </a>{" "}
              or{" "}
              <a
                href={DIGIKON_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-saffron underline-offset-4 hover:underline"
              >
                WhatsApp
              </a>{" "}
              at {DIGIKON_PHONE_DISPLAY} for a quicker chat.
            </p>
            {serviceFromQuery ? (
              <p className="mt-4 text-sm text-muted-foreground md:text-base">
                You&apos;re requesting a consult for{" "}
                <strong className="text-foreground">
                  {serviceFromQuery.title}
                </strong>
                .
              </p>
            ) : null}
          </div>
        </section>
        <Suspense fallback={<ContactFallback id="consult" />}>
          <ContactSection
            id="consult"
            heading="Request your consult"
            description="Fill out the form below and we'll get back to you within two business days."
            formContext="consult"
            marketingServiceId={marketingServiceId}
            loginNext={loginNext}
          />
        </Suspense>
      </main>
      <MarketingFooter />
    </div>
  );
}

export default function ConsultPage(props: ConsultPageProps) {
  return (
    <Suspense fallback={<ConsultPageFallback />}>
      <ConsultPageContent {...props} />
    </Suspense>
  );
}
