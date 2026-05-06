"use client";

import {
  submitTestimonial,
  type TestimonialFormState,
} from "@/app/actions/testimonial";
import { marketingIconKeys } from "@/lib/marketing-icons";
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
import { useActionState, useEffect, useRef } from "react";

const initialState: TestimonialFormState = { status: "idle" };

const textareaClassName = cn(
  "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
);

export function AddTestimonialForm() {
  const [state, formAction, isPending] = useActionState(
    submitTestimonial,
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
        <CardTitle className="text-xl">Your testimonial</CardTitle>
        <CardDescription>
          Share a short quote we can show on the homepage. It appears after you
          submit (highest ratings are listed first).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="tm-name">Name</Label>
            <Input
              id="tm-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              aria-invalid={fieldErrors.name ? true : undefined}
            />
            {fieldErrors.name ? (
              <p className="text-sm text-destructive">{fieldErrors.name}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-icon">Icon</Label>
            <select
              id="tm-icon"
              name="icon"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
              defaultValue={marketingIconKeys()[0]}
              aria-invalid={fieldErrors.icon ? true : undefined}
            >
              {marketingIconKeys().map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            {fieldErrors.icon ? (
              <p className="text-sm text-destructive">{fieldErrors.icon}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-rating">Rating (0–5)</Label>
            <Input
              id="tm-rating"
              name="rating"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              max={5}
              required
              aria-invalid={fieldErrors.rating ? true : undefined}
            />
            {fieldErrors.rating ? (
              <p className="text-sm text-destructive">{fieldErrors.rating}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-message">Message</Label>
            <textarea
              id="tm-message"
              name="message"
              className={textareaClassName}
              required
              rows={5}
              maxLength={2000}
              placeholder="What stood out about working with us?"
              aria-invalid={fieldErrors.message ? true : undefined}
            />
            {fieldErrors.message ? (
              <p className="text-sm text-destructive">{fieldErrors.message}</p>
            ) : null}
          </div>
          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-muted-foreground" role="status">
              Thank you — your testimonial was published.
            </p>
          ) : null}
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? "Saving…" : "Publish testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
