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
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
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
