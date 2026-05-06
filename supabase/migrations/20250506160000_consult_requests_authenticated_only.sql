-- Restrict consult form inserts to signed-in users (matches app UI + submitLead guard).
drop policy if exists "consult_requests_insert_public" on public.consult_requests;

create policy "consult_requests_insert_authenticated"
  on public.consult_requests
  for insert
  to authenticated
  with check (true);
