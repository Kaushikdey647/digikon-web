-- RBAC: app_role enum, user_roles, is_admin(), admin RLS on CMS tables.
-- Bootstrap first admin (run in SQL editor with your user UUID):
--   insert into public.user_roles (user_id, role) values ('<uuid>', 'admin');

-- ---------------------------------------------------------------------------
-- Enum and user_roles
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'clients');

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  primary key (user_id, role)
);

create index user_roles_user_id_idx on public.user_roles (user_id);

comment on table public.user_roles is 'Role assignments; only service role / SQL should INSERT. Admins have row (user_id, admin).';

alter table public.user_roles enable row level security;

create policy "user_roles_select_own"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

-- No insert/update/delete for API roles — assign roles via Dashboard SQL or service role.

-- ---------------------------------------------------------------------------
-- is_admin() for RLS (SECURITY INVOKER; safe search_path)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'::public.app_role
  );
$$;

comment on function public.is_admin() is 'True when the current auth user has admin in user_roles.';

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- marketing_services: admin CUD (public SELECT unchanged)
-- ---------------------------------------------------------------------------
create policy "marketing_services_insert_admin"
  on public.marketing_services
  for insert
  to authenticated
  with check (public.is_admin());

create policy "marketing_services_update_admin"
  on public.marketing_services
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "marketing_services_delete_admin"
  on public.marketing_services
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- consult_requests: admin read-only
-- ---------------------------------------------------------------------------
create policy "consult_requests_select_admin"
  on public.consult_requests
  for select
  to authenticated
  using (public.is_admin());
