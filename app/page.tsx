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
import {
  DIGIKON_PHONE_E164,
  INSTAGRAM_PROFILE_URL,
} from "@/lib/marketing-links";
import { SITE_SEO_DESCRIPTION } from "@/lib/site-brand";
import type { Metadata } from "next";
import { Suspense } from "react";

const siteUrl = getSiteUrl();
const homeDescription = SITE_SEO_DESCRIPTION;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: siteUrl,
    title: "Digikon Marketing | Brands built with digital excellence",
    description: homeDescription,
  },
  twitter: {
    title: "Digikon Marketing | Brands built with digital excellence",
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
      sameAs: [INSTAGRAM_PROFILE_URL],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: DIGIKON_PHONE_E164,
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
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
