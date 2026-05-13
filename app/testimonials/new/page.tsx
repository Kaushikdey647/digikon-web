import { AddTestimonialForm } from "@/components/marketing/add-testimonial-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Add a testimonial",
  description:
    "Signed-in clients can share a public testimonial for Digikon Marketing.",
  robots: { index: false, follow: false },
};

export default function AddTestimonialPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <section className="border-b border-border/80 px-5 py-14 md:py-20">
              <div className="mx-auto max-w-lg">
                <div className="mb-10 h-40 animate-pulse rounded-lg bg-muted/50" />
                <div className="h-96 animate-pulse rounded-xl border border-border/80 bg-muted/30" />
              </div>
            </section>
          }
        >
          <AddTestimonialGate />
        </Suspense>
      </main>
      <MarketingFooter />
    </div>
  );
}

async function AddTestimonialGate() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/auth/login?next=%2Ftestimonials%2Fnew");
  }

  return (
    <section className="border-b border-border/80 px-5 py-14 md:py-20">
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Add a testimonial
          </h1>
          <p className="mt-3 text-muted-foreground">
            Signed in with Google.{" "}
            <Link
              href="/"
              className="text-saffron underline-offset-4 hover:underline"
            >
              Home
            </Link>
          </p>
        </div>
        <AddTestimonialForm />
      </div>
    </section>
  );
}
