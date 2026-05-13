import { Suspense } from "react";
import { AdminTestimonialsTable } from "@/components/admin/admin-testimonials-table";
import type { TestimonialRow } from "@/components/marketing/testimonial-card";
import { createClient } from "@/lib/supabase/server";

export default function AdminTestimonialsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">Loading testimonials…</p>
      }
    >
      <TestimonialsContent />
    </Suspense>
  );
}

async function TestimonialsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, icon, rating, message")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Testimonials</h1>
        <p className="mt-2 text-destructive" role="alert">
          Could not load testimonials.
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as TestimonialRow[];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Testimonials</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add new rows at the bottom; Save inserts them. Existing rows cannot be
          updated or deleted here.
        </p>
      </div>
      <AdminTestimonialsTable existing={rows} />
    </div>
  );
}
