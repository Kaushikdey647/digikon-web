import { LeadForm } from "@/components/marketing/lead-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type ContactSectionProps = {
  id?: string;
  heading?: string;
  description?: string;
  formContext?: "home" | "consult";
};

export async function ContactSection({
  id = "contact",
  heading = "Get in touch",
  description = "Ready to grow? Send a note and we'll schedule a short intro call.",
  formContext = "home",
}: ContactSectionProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const isSignedIn = !error && Boolean(data?.claims?.sub);

  const loginNext = formContext === "consult" ? "/consult" : "/#contact";
  const loginHref = `/auth/login?next=${encodeURIComponent(loginNext)}`;

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
        {isSignedIn ? (
          <LeadForm formContext={formContext} />
        ) : (
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign in to send a message</CardTitle>
              <CardDescription>
                Use your Google account so we can route your request securely.
                We still respond within two business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full sm:w-auto">
                <Link href={loginHref}>Sign in with Google</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
