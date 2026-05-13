"use client";

import {
  saveMarketingServices,
  type AdminMarketingRowInput,
} from "@/app/actions/admin-marketing-services";
import type { MarketingServiceRow } from "@/lib/marketing";
import { marketingIconKeys } from "@/lib/marketing-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

type EditableRow = {
  id: string | null;
  slug: string;
  title: string;
  description: string;
  icon_key: string;
  sort_order: number;
  home_featured_rank: number | null;
  roadmap_md: string;
  sla_md: string;
  examples: string;
  testimonial_id: string;
};

function toEditable(rows: MarketingServiceRow[]): EditableRow[] {
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    icon_key: r.icon_key,
    sort_order: r.sort_order,
    home_featured_rank: r.home_featured_rank,
    roadmap_md: r.roadmap_md ?? "",
    sla_md: r.sla_md ?? "",
    examples: JSON.stringify(r.examples ?? [], null, 2),
    testimonial_id: r.testimonial_id ?? "",
  }));
}

function stableSerialize(rows: EditableRow[]): string {
  const sorted = [...rows].sort((a, b) => {
    const ak = a.id ?? `~${a.slug}`;
    const bk = b.id ?? `~${b.slug}`;
    return ak.localeCompare(bk);
  });
  return JSON.stringify(sorted);
}

function toPayload(rows: EditableRow[]): AdminMarketingRowInput[] {
  return rows.map((r) => {
    const rank = r.home_featured_rank;
    const homeFeatured =
      rank !== null &&
      Number.isFinite(rank) &&
      Number.isInteger(rank) &&
      rank >= 1 &&
      rank <= 4
        ? rank
        : null;
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      icon_key: r.icon_key,
      sort_order: Number.isFinite(r.sort_order) ? Math.trunc(r.sort_order) : 0,
      home_featured_rank: homeFeatured,
      roadmap_md: r.roadmap_md.trim() || null,
      sla_md: r.sla_md.trim() || null,
      examples: r.examples,
      testimonial_id: r.testimonial_id.trim() || null,
    };
  });
}

const emptyRow = (): EditableRow => ({
  id: null,
  slug: "new-service",
  title: "New service",
  description: "Description",
  icon_key: "Search",
  sort_order: 100,
  home_featured_rank: null,
  roadmap_md: "",
  sla_md: "",
  examples: "[]",
  testimonial_id: "",
});

export function AdminMarketingTable({
  initialRows,
}: {
  initialRows: MarketingServiceRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<EditableRow[]>(() => toEditable(initialRows));
  const [snapshot, setSnapshot] = useState(() => stableSerialize(toEditable(initialRows)));

  useEffect(() => {
    const next = toEditable(initialRows);
    setRows(next);
    setSnapshot(stableSerialize(next));
  }, [initialRows]);

  const dirty = useMemo(() => stableSerialize(rows) !== snapshot, [rows, snapshot]);

  const discard = useCallback(() => {
    setRows(JSON.parse(snapshot) as EditableRow[]);
    setError(null);
  }, [snapshot]);

  const save = useCallback(() => {
    setError(null);
    startTransition(async () => {
      const res = await saveMarketingServices(toPayload(rows));
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSnapshot(stableSerialize(rows));
      router.refresh();
    });
  }, [rows, router]);

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
          onClick={() => setRows((r) => [...r, emptyRow()])}
        >
          Add row
        </Button>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur">
            <tr className="border-b text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="p-2">Slug</th>
              <th className="p-2">Title</th>
              <th className="p-2">Icon</th>
              <th className="p-2">Order</th>
              <th className="p-2">Featured</th>
              <th className="p-2">Testimonial id</th>
              <th className="p-2 w-16" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <MarketingServiceBlock
                key={row.id ?? `new-${idx}`}
                row={row}
                idx={idx}
                icons={icons}
                canRemove={rows.length > 1}
                onChange={(patch) =>
                  setRows((prev) =>
                    prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
                  )
                }
                onRemove={() =>
                  setRows((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MarketingServiceBlock({
  row,
  idx,
  icons,
  canRemove,
  onChange,
  onRemove,
}: {
  row: EditableRow;
  idx: number;
  icons: string[];
  canRemove: boolean;
  onChange: (p: Partial<EditableRow>) => void;
  onRemove: () => void;
}) {
  return (
    <>
      <tr className="border-b align-top">
        <td className="p-2">
          <Input
            value={row.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            aria-label={`Row ${idx + 1} slug`}
          />
        </td>
        <td className="p-2">
          <Input
            value={row.title}
            onChange={(e) => onChange({ title: e.target.value })}
            aria-label={`Row ${idx + 1} title`}
          />
        </td>
        <td className="p-2">
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            value={row.icon_key}
            onChange={(e) => onChange({ icon_key: e.target.value })}
            aria-label={`Row ${idx + 1} icon`}
          >
            {icons.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </td>
        <td className="p-2 w-24">
          <Input
            type="number"
            value={row.sort_order}
            onChange={(e) =>
              onChange({ sort_order: Number.parseInt(e.target.value, 10) || 0 })
            }
            aria-label={`Row ${idx + 1} sort order`}
          />
        </td>
        <td className="p-2 w-24">
          <Input
            type="number"
            min={1}
            max={4}
            value={row.home_featured_rank ?? ""}
            placeholder="—"
            onChange={(e) => {
              const v = e.target.value.trim();
              if (!v) {
                onChange({ home_featured_rank: null });
                return;
              }
              const n = Number.parseInt(v, 10);
              onChange({
                home_featured_rank: Number.isFinite(n) ? n : null,
              });
            }}
            aria-label={`Row ${idx + 1} featured rank`}
          />
        </td>
        <td className="p-2">
          <Input
            value={row.testimonial_id}
            onChange={(e) => onChange({ testimonial_id: e.target.value })}
            placeholder="UUID"
            aria-label={`Row ${idx + 1} testimonial id`}
          />
        </td>
        <td className="p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canRemove}
            onClick={onRemove}
            aria-label={`Remove row ${idx + 1}`}
          >
            Remove
          </Button>
        </td>
      </tr>
      <tr className="border-b bg-muted/10 align-top">
        <td className="p-2" colSpan={7}>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Description</p>
          <Textarea
            rows={2}
            value={row.description}
            onChange={(e) => onChange({ description: e.target.value })}
            aria-label={`Row ${idx + 1} description`}
          />
        </td>
      </tr>
      <tr className="border-b bg-muted/10 align-top">
        <td className="p-2" colSpan={7}>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Roadmap (markdown)</p>
          <Textarea
            rows={3}
            value={row.roadmap_md}
            onChange={(e) => onChange({ roadmap_md: e.target.value })}
          />
        </td>
      </tr>
      <tr className="border-b bg-muted/10 align-top">
        <td className="p-2" colSpan={7}>
          <p className="mb-1 text-xs font-medium text-muted-foreground">SLA (markdown)</p>
          <Textarea
            rows={3}
            value={row.sla_md}
            onChange={(e) => onChange({ sla_md: e.target.value })}
          />
        </td>
      </tr>
      <tr className="border-b-2 border-border align-top">
        <td className="p-2 pb-6" colSpan={7}>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Examples (JSON array)
          </p>
          <Textarea
            rows={4}
            className="font-mono text-xs"
            value={row.examples}
            onChange={(e) => onChange({ examples: e.target.value })}
            spellCheck={false}
          />
        </td>
      </tr>
    </>
  );
}
