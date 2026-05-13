import { ContactFallback } from "@/components/marketing/contact-fallback";
import { ContactSection } from "@/components/marketing/contact-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ServiceMarkdown } from "@/components/marketing/service-markdown";
import { SiteHeader } from "@/components/marketing/site-header";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMarketingIcon } from "@/lib/marketing-icons";
import {
  getServiceBySlug,
  parseServiceExamples,
} from "@/lib/marketing";
import { Search, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return {
      title: "Service",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `/services/${service.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.description,
    },
  };
}

function ServiceSlugPageFallback() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-5 py-16">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-10 w-full max-w-md rounded bg-muted" />
          <div className="h-24 w-full rounded bg-muted" />
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

async function ServiceDetailInner(props: PageProps) {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = getMarketingIcon(service.icon_key) ?? Search;
  const examples = parseServiceExamples(service.examples);
  const consultQuery = `/consult?service=${encodeURIComponent(service.slug)}`;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/80 px-5 py-8 md:py-10">
          <nav
            className="mx-auto flex max-w-3xl flex-wrap items-center gap-1 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
            <span className="text-foreground">{service.title}</span>
          </nav>

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-6 w-6 text-foreground" aria-hidden />
                </div>
                <div>
                  <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    {service.title}
                  </h1>
                  <p className="mt-3 text-muted-foreground md:text-lg">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="#consult">Request a consult</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={consultQuery}>Open consult page</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-14 px-5 py-12 md:py-16">
          {service.roadmap_md ? (
            <section aria-labelledby="roadmap-heading">
              <h2
                id="roadmap-heading"
                className="text-xl font-semibold tracking-tight"
              >
                Roadmap
              </h2>
              <ServiceMarkdown
                className="mt-4 border-t border-border/80 pt-6"
                markdown={service.roadmap_md}
              />
            </section>
          ) : null}

          {service.sla_md ? (
            <section aria-labelledby="sla-heading">
              <h2 id="sla-heading" className="text-xl font-semibold tracking-tight">
                SLA &amp; expectations
              </h2>
              <ServiceMarkdown
                className="mt-4 border-t border-border/80 pt-6"
                markdown={service.sla_md}
              />
            </section>
          ) : null}

          {examples.length > 0 ? (
            <section aria-labelledby="examples-heading">
              <h2
                id="examples-heading"
                className="text-xl font-semibold tracking-tight"
              >
                Examples
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {examples.map((ex) => (
                  <li key={ex.title}>
                    <Card className="h-full border-border/80 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{ex.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {ex.summary}
                        </CardDescription>
                      </CardHeader>
                      {ex.url ? (
                        <CardContent className="pt-0">
                          <a
                            href={ex.url}
                            className="text-sm font-medium text-saffron underline-offset-4 hover:underline"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            View link
                          </a>
                        </CardContent>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {service.testimonial ? (
            <section aria-labelledby="service-testimonial-heading">
              <h2
                id="service-testimonial-heading"
                className="text-xl font-semibold tracking-tight"
              >
                What clients say
              </h2>
              <div className="mt-6 max-w-xl">
                <TestimonialCard testimonial={service.testimonial} />
              </div>
            </section>
          ) : null}
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-border/80 bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
          <Button asChild className="pointer-events-auto w-full max-w-md shadow-md">
            <Link href="#consult">Request a consult</Link>
          </Button>
        </div>

        <Suspense fallback={<ContactFallback id="consult" />}>
          <ContactSection
            id="consult"
            heading={`Request a consult — ${service.title}`}
            description="Sign in to send your request. We respond within two business days."
            formContext="consult"
            marketingServiceId={service.id}
            loginNext={`/services/${service.slug}#consult`}
          />
        </Suspense>
      </main>
      <MarketingFooter />
    </div>
  );
}

export default function ServiceDetailPage(props: PageProps) {
  return (
    <Suspense fallback={<ServiceSlugPageFallback />}>
      <ServiceDetailInner {...props} />
    </Suspense>
  );
}
