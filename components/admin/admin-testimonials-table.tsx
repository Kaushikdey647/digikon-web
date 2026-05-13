"use client";

import { insertTestimonialDrafts } from "@/app/actions/admin-testimonials";
import type { TestimonialRow } from "@/components/marketing/testimonial-card";
import { marketingIconKeys } from "@/lib/marketing-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

type Draft = {
  key: string;
  name: string;
  icon: string;
  rating: number;
  message: string;
};

function emptyDraft(): Draft {
  return {
    key: `draft-${crypto.randomUUID()}`,
    name: "",
    icon: "User",
    rating: 5,
    message: "",
  };
}

function draftsSnapshot(drafts: Draft[]): string {
  return JSON.stringify(
    [...drafts].sort((a, b) => a.key.localeCompare(b.key)),
  );
}

export function AdminTestimonialsTable({
  existing,
}: {
  existing: TestimonialRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [snapshot, setSnapshot] = useState("[]");

  const dirty = useMemo(() => draftsSnapshot(drafts) !== snapshot, [drafts, snapshot]);

  const discard = useCallback(() => {
    setDrafts(JSON.parse(snapshot) as Draft[]);
    setError(null);
  }, [snapshot]);

  const save = useCallback(() => {
    setError(null);
    startTransition(async () => {
      const res = await insertTestimonialDrafts(
        drafts.map((d) => ({
          name: d.name,
          icon: d.icon,
          rating: d.rating,
          message: d.message,
        })),
      );
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDrafts([]);
      setSnapshot("[]");
      router.refresh();
    });
  }, [drafts, router]);

  const icons = marketingIconKeys();

  return (
    <div className="flex max-h-[calc(100vh-10rem)] flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={dirty ? "default" : "secondary"}
          disabled={!dirty || pending}
          onClick={() => void save()}
        >
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!dirty || pending}
          onClick={discard}
        >
          Discard
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setDrafts((d) => [...d, emptyDraft()])}
        >
          Add row
        </Button>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        Existing testimonials are read-only here. New rows below are inserted on Save;
        updates and deletes are not available.
      </p>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur">
            <tr className="border-b text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="p-2">Name</th>
              <th className="p-2">Icon</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {existing.map((t) => (
              <tr key={t.id} className="border-b align-top opacity-90">
                <td className="p-2">
                  <Input value={t.name} readOnly disabled />
                </td>
                <td className="p-2">
                  <Input value={t.icon} readOnly disabled />
                </td>
                <td className="p-2 w-24">
                  <Input value={String(t.rating)} readOnly disabled />
                </td>
                <td className="p-2">
                  <Textarea value={t.message} readOnly disabled rows={2} />
                </td>
              </tr>
            ))}
            {drafts.map((d, idx) => (
              <tr key={d.key} className="border-b align-top bg-primary/5">
                <td className="p-2">
                  <Input
                    value={d.name}
                    onChange={(e) =>
                      setDrafts((prev) =>
                        prev.map((x, i) =>
                          i === idx ? { ...x, name: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Name"
                    aria-label={`New testimonial ${idx + 1} name`}
                  />
                </td>
                <td className="p-2">
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={d.icon}
                    onChange={(e) =>
                      setDrafts((prev) =>
                        prev.map((x, i) =>
                          i === idx ? { ...x, icon: e.target.value } : x,
                        ),
                      )
                    }
                    aria-label={`New testimonial ${idx + 1} icon`}
                  >
                    {icons.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 w-28">
                  <Input
                    type="number"
                    step={0.1}
                    min={0}
                    max={5}
                    value={d.rating}
                    onChange={(e) =>
                      setDrafts((prev) =>
                        prev.map((x, i) =>
                          i === idx
                            ? {
                                ...x,
                                rating: Number.parseFloat(e.target.value) || 0,
                              }
                            : x,
                        ),
                      )
                    }
                  />
                </td>
                <td className="p-2">
                  <Textarea
                    rows={2}
                    value={d.message}
                    onChange={(e) =>
                      setDrafts((prev) =>
                        prev.map((x, i) =>
                          i === idx ? { ...x, message: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Message"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
