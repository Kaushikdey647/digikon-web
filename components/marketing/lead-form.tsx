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

export function LeadForm() {
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

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Start a conversation</CardTitle>
        <CardDescription>
          Share your goals and we&apos;ll get back to you within two business
          days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-5">
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
            {isPending ? "Sending…" : "Request consult"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
