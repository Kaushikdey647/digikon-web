-- Marketing content and lead capture for Digikon web
-- (gen_random_uuid is built into PostgreSQL 13+)

-- ---------------------------------------------------------------------------
-- What we do (services grid)
-- ---------------------------------------------------------------------------
create table public.marketing_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_key text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.marketing_services is 'CMS-style cards for the "What we do" section; icon_key maps to a Lucide icon allow-list in the app.';

alter table public.marketing_services enable row level security;

create policy "marketing_services_select_public"
  on public.marketing_services
  for select
  to anon, authenticated
  using (true);

-- Writes are done via Supabase Dashboard / service role migrations only.

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null,
  rating double precision not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint testimonials_rating_range check (rating >= 0 and rating <= 5)
);

comment on table public.testimonials is 'Client quotes; icon is a Lucide icon name allow-listed in the app.';

create index testimonials_rating_desc_idx on public.testimonials (rating desc, created_at desc);

alter table public.testimonials enable row level security;

create policy "testimonials_select_public"
  on public.testimonials
  for select
  to anon, authenticated
  using (true);

create policy "testimonials_insert_authenticated"
  on public.testimonials
  for insert
  to authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Consult / contact form submissions
-- ---------------------------------------------------------------------------
create table public.consult_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  form_context text not null default 'home',
  created_at timestamptz not null default now(),
  constraint consult_requests_form_context_check check (form_context in ('home', 'consult'))
);

comment on table public.consult_requests is 'Inbound consult requests from the marketing site; no client read access.';

alter table public.consult_requests enable row level security;

create policy "consult_requests_insert_public"
  on public.consult_requests
  for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Seed default services (same copy as previous static marketing grid)
-- ---------------------------------------------------------------------------
insert into public.marketing_services (title, description, icon_key, sort_order)
values
  ('Search & SEO', 'Technical audits, content strategy, and sustainable organic growth.', 'Search', 10),
  ('Paid media', 'Search and social campaigns tuned for CPA, ROAS, and scale.', 'Megaphone', 20),
  ('Content & creative', 'Brand storytelling, landing pages, and assets that convert.', 'PenLine', 30),
  ('Analytics', 'Measurement frameworks, reporting, and insight-led optimization.', 'BarChart3', 40);

-- Optional starter testimonials (remove or edit in Dashboard as needed)
insert into public.testimonials (name, icon, rating, message)
values
  (
    'Alex Rivera',
    'User',
    5,
    'Digikon tightened our paid search and reporting in weeks. We finally see which campaigns actually move revenue, not just clicks.'
  ),
  (
    'Sam Okonkwo',
    'Building2',
    4.5,
    'Clear communication and fast iteration. Our landing tests went from idea to live without the usual agency drag.'
  ),
  (
    'Jordan Lee',
    'Sparkles',
    4.8,
    'They treated our budget like their own. SEO and content finally tell one story — our pipeline noticed.'
  );
