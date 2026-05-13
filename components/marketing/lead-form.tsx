"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/lead";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialState: LeadFormState = { status: "idle" };

const textareaClassName = cn(
  "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
);

type LeadFormProps = {
  formContext?: "home" | "consult";
  marketingServiceId?: string | null;
  /** When set on consult, name/email are taken from the signed-in account (server + UI). */
  consultAuthProfile?: { email: string; name: string } | null;
};

export function LeadForm({
  formContext = "home",
  marketingServiceId = null,
  consultAuthProfile = null,
}: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitLead,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const fieldErrors =
    state.status === "error" ? state.fieldErrors ?? {} : {};
  const formError = state.status === "error" ? state.error : null;
  const success = state.status === "success";

  const useAccountIdentity =
    formContext === "consult" && consultAuthProfile !== null;

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          {useAccountIdentity ? "Complete your consult request" : "Start a conversation"}
        </CardTitle>
        <CardDescription>
          {useAccountIdentity ? (
            <>
              Add a short message and confirm we can contact you. We&apos;ll use
              the name and email from your Google sign-in.
            </>
          ) : (
            <>
              Share your goals and we&apos;ll get back to you within two business
              days.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-5">
          <input type="hidden" name="form_context" value={formContext} />
          {marketingServiceId ? (
            <input
              type="hidden"
              name="marketing_service_id"
              value={marketingServiceId}
            />
          ) : null}
          {useAccountIdentity && consultAuthProfile ? (
            <div
              className="rounded-md border border-border/80 bg-muted/30 px-3 py-3 text-sm text-muted-foreground"
              role="status"
            >
              <p>
                <span className="text-foreground">Name:</span>{" "}
                {consultAuthProfile.name}
              </p>
              <p className="mt-1">
                <span className="text-foreground">Email:</span>{" "}
                {consultAuthProfile.email}
              </p>
            </div>
          ) : null}
          {!useAccountIdentity ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="lead-name">Name</Label>
                <Input
                  id="lead-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  aria-invalid={fieldErrors.name ? true : undefined}
                  aria-describedby={
                    fieldErrors.name ? "lead-name-error" : undefined
                  }
                />
                {fieldErrors.name ? (
                  <p id="lead-name-error" className="text-sm text-destructive">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={
                    fieldErrors.email ? "lead-email-error" : undefined
                  }
                />
                {fieldErrors.email ? (
                  <p id="lead-email-error" className="text-sm text-destructive">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="lead-message">Message</Label>
            <textarea
              id="lead-message"
              name="message"
              className={textareaClassName}
              required
              rows={5}
              maxLength={5000}
              placeholder="Tell us about your business and what you want to achieve…"
              aria-invalid={fieldErrors.message ? true : undefined}
              aria-describedby={
                fieldErrors.message ? "lead-message-error" : undefined
              }
            />
            {fieldErrors.message ? (
              <p id="lead-message-error" className="text-sm text-destructive">
                {fieldErrors.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <input
                id="lead-privacy-consent"
                name="privacy_consent"
                type="checkbox"
                value="on"
                required
                className="mt-1.5 h-4 w-4 shrink-0 rounded border border-input accent-primary"
                aria-invalid={fieldErrors.privacy_consent ? true : undefined}
                aria-describedby={
                  fieldErrors.privacy_consent
                    ? "lead-privacy-consent-error"
                    : undefined
                }
              />
              <Label
                htmlFor="lead-privacy-consent"
                className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground"
              >
                I agree to be contacted about this request and understand how my
                information will be used to respond.
              </Label>
            </div>
            {fieldErrors.privacy_consent ? (
              <p
                id="lead-privacy-consent-error"
                className="text-sm text-destructive"
              >
                {fieldErrors.privacy_consent}
              </p>
            ) : null}
          </div>
          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-muted-foreground" role="status">
              Thanks — your message was sent. We&apos;ll be in touch soon.
            </p>
          ) : null}
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending
              ? "Sending…"
              : formContext === "consult"
                ? "Request consult"
                : "Send message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
