import { AboutSection } from "@/components/marketing/about-section";
import {
  ServicesSectionFallback,
  TestimonialsSectionFallback,
} from "@/components/marketing/async-section-fallbacks";
import { ContactFallback } from "@/components/marketing/contact-fallback";
import { ContactSection } from "@/components/marketing/contact-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ServicesSection } from "@/components/marketing/services-section";
import { SiteHeader } from "@/components/marketing/site-header";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

const siteUrl = getSiteUrl();
const homeDescription =
  "Digikon Marketing helps brands grow with SEO, paid media, content, and analytics — strategy through optimization.";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: siteUrl,
    title: "Digikon Marketing | Digital marketing agency",
    description: homeDescription,
  },
  twitter: {
    title: "Digikon Marketing | Digital marketing agency",
    description: homeDescription,
  },
};

const orgId = `${siteUrl}/#organization`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: "Digikon Marketing",
      url: siteUrl,
      description: homeDescription,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Digikon Marketing",
      url: siteUrl,
      description: homeDescription,
      publisher: { "@id": orgId },
    },
  ],
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={structuredData} />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<ServicesSectionFallback />}>
          <ServicesSection />
        </Suspense>
        <AboutSection />
        <Suspense fallback={<TestimonialsSectionFallback />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<ContactFallback />}>
          <ContactSection />
        </Suspense>
      </main>
      <MarketingFooter />
    </div>
  );
}
