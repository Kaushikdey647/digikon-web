import { LeadForm } from "@/components/marketing/lead-form";
import { fullNameForLead } from "@/lib/auth-user-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  DIGIKON_PHONE_DISPLAY,
  DIGIKON_PHONE_E164,
  DIGIKON_WHATSAPP_URL,
  INSTAGRAM_PROFILE_URL,
} from "@/lib/marketing-links";
import Link from "next/link";

type ContactSectionProps = {
  id?: string;
  heading?: string;
  description?: string;
  formContext?: "home" | "consult";
  /** When set, submitted consults are attributed to this service. */
  marketingServiceId?: string | null;
  /** Post-login redirect (include hash when the form lives under #consult). */
  loginNext?: string;
};

export async function ContactSection({
  id = "contact",
  heading = "Get in touch",
  description = "Tell us what you need — social, SEO, content, ads, design, apps, or something else. We reply within two business days.",
  formContext = "home",
  marketingServiceId = null,
  loginNext: loginNextOverride,
}: ContactSectionProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const isSignedIn = !error && Boolean(data?.claims?.sub);

  let consultAuthProfile: { email: string; name: string } | null = null;
  if (isSignedIn && formContext === "consult") {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user?.email?.trim()) {
      consultAuthProfile = {
        email: user.email.trim(),
        name: fullNameForLead(user),
      };
    }
  }

  const defaultLoginNext =
    formContext === "consult" ? "/consult" : "/#contact";
  const loginNext = loginNextOverride ?? defaultLoginNext;
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
        <div className="mb-8 rounded-lg border border-border/80 bg-muted/20 px-4 py-4 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Reach us directly</p>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a
              href={DIGIKON_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron underline-offset-4 hover:underline"
            >
              WhatsApp
            </a>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <a
              href={`tel:${DIGIKON_PHONE_E164}`}
              className="text-saffron underline-offset-4 hover:underline"
            >
              {DIGIKON_PHONE_DISPLAY}
            </a>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron underline-offset-4 hover:underline"
            >
              Instagram
            </a>
          </p>
        </div>
        {isSignedIn ? (
          formContext === "consult" && !consultAuthProfile ? (
            <Card className="border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Email required</CardTitle>
                <CardDescription>
                  Your signed-in account does not have an email we can use for
                  follow-up. Sign out, sign in with a provider that shares an
                  email, or contact us from the home page contact form after
                  updating your profile.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <LeadForm
              formContext={formContext}
              marketingServiceId={marketingServiceId}
              consultAuthProfile={consultAuthProfile}
            />
          )
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
