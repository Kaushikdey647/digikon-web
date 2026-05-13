-- Every new auth user gets role `clients` in public.user_roles.
-- Existing users are backfilled in the same migration.

-- ---------------------------------------------------------------------------
-- Trigger: assign clients on signup (first auth.users insert)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'clients'::public.app_role)
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Inserts default app_role clients for each new auth.users row; runs as definer to bypass user_roles RLS.';

-- Not intended for direct invocation from the API.
revoke all on function public.handle_new_user() from public;

drop trigger if exists assign_default_client_role on auth.users;

create trigger assign_default_client_role
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Backfill: users created before this trigger
-- ---------------------------------------------------------------------------
insert into public.user_roles (user_id, role)
select u.id, 'clients'::public.app_role
from auth.users u
where not exists (
  select 1
  from public.user_roles ur
  where ur.user_id = u.id
    and ur.role = 'clients'::public.app_role
)
on conflict (user_id, role) do nothing;

comment on table public.user_roles is
  'Role assignments: new users get clients via assign_default_client_role; admins (admin) are assigned in SQL or service role.';
