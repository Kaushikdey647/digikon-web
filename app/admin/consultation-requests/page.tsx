import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

export default function AdminConsultationRequestsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">Loading consultation requests…</p>
      }
    >
      <ConsultationRequestsContent />
    </Suspense>
  );
}

async function ConsultationRequestsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consult_requests")
    .select(
      "id, name, email, message, form_context, created_at, marketing_service_id, privacy_consent_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Consultation Requests</h1>
        <p className="mt-2 text-destructive" role="alert">
          Could not load requests.
        </p>
      </div>
    );
  }

  const rows = data ?? [];

  return (
    <div className="flex max-h-[calc(100vh-10rem)] flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Consultation Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Read-only. Data is managed in Supabase; submissions are never edited from
          this UI.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur">
            <tr className="border-b text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="p-2">Created</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Context</th>
              <th className="p-2">Service id</th>
              <th className="p-2">Consent</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-muted-foreground">
                  No consultation requests yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b align-top">
                  <td className="whitespace-nowrap p-2 text-muted-foreground">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.form_context}</td>
                  <td className="max-w-[120px] truncate p-2 font-mono text-xs">
                    {r.marketing_service_id ?? "—"}
                  </td>
                  <td className="whitespace-nowrap p-2 text-muted-foreground">
                    {r.privacy_consent_at
                      ? new Date(r.privacy_consent_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2">
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-sans text-xs">
                      {r.message}
                    </pre>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
