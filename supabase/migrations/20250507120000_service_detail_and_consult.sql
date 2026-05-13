-- Service detail CMS fields, home featured ranks, consult attribution + consent

-- ---------------------------------------------------------------------------
-- marketing_services: slug, featured rank, rich content, testimonial link
-- ---------------------------------------------------------------------------
alter table public.marketing_services
  add column slug text,
  add column home_featured_rank smallint,
  add column roadmap_md text,
  add column sla_md text,
  add column examples jsonb not null default '[]'::jsonb,
  add column testimonial_id uuid references public.testimonials (id) on delete set null;

alter table public.marketing_services
  add constraint marketing_services_home_featured_rank_range
  check (
    home_featured_rank is null
    or (home_featured_rank >= 1 and home_featured_rank <= 4)
  );

comment on column public.marketing_services.slug is 'URL segment under /services/[slug]; unique.';
comment on column public.marketing_services.home_featured_rank is '1–4 = order on home; null = catalog only.';
comment on column public.marketing_services.examples is 'CMS JSON array: {title, summary, url?}.';

-- Backfill slugs for known seed titles
update public.marketing_services
set slug = 'search-seo'
where title = 'Search & SEO';

update public.marketing_services
set slug = 'paid-media'
where title = 'Paid media';

update public.marketing_services
set slug = 'content-creative'
where title = 'Content & creative';

update public.marketing_services
set slug = 'analytics'
where title = 'Analytics';

-- Any remaining rows (future inserts before slug required)
update public.marketing_services
set slug = trim(
  both '-'
  from regexp_replace(lower(regexp_replace(title, '&', ' and ', 'g')), '[^a-z0-9]+', '-', 'g')
)
where slug is null;

alter table public.marketing_services
  alter column slug set not null;

create unique index marketing_services_slug_unique on public.marketing_services (slug);

-- Home featured order (matches previous home grid order)
update public.marketing_services
set home_featured_rank = 1
where slug = 'search-seo';

update public.marketing_services
set home_featured_rank = 2
where slug = 'paid-media';

update public.marketing_services
set home_featured_rank = 3
where slug = 'content-creative';

update public.marketing_services
set home_featured_rank = 4
where slug = 'analytics';

-- Assign testimonials by service sort_order (cycle through testimonials by created_at)
with
  svc as (
    select
      id,
      row_number() over (order by sort_order asc) as rn
    from public.marketing_services
  ),
  tst as (
    select
      id,
      row_number() over (order by created_at asc) as rn
    from public.testimonials
  ),
  tc as (
    select count(*)::int as n from public.testimonials
  ),
  picked as (
    select
      svc.id as service_id,
      tst.id as testimonial_id
    from svc
    cross join tc
    join tst on tst.rn = case
      when tc.n > 0 then ((svc.rn - 1) % tc.n) + 1
      else null
    end
  )
update public.marketing_services ms
set testimonial_id = picked.testimonial_id
from picked
where ms.id = picked.service_id;

-- Starter roadmap / SLA / examples (optional content for detail pages)
update public.marketing_services
set
  roadmap_md = e.roadmap,
  sla_md = e.sla,
  examples = e.examples::jsonb
from (
  values
    (
      'search-seo',
      '## Discovery' || chr(10) || '- Goals, audience, and competitive set' || chr(10) || chr(10) || '## Technical baseline' || chr(10) || '- Crawl, indexation, and Core Web Vitals review' || chr(10) || chr(10) || '## Roadmap' || chr(10) || '- Quick wins, then sustained content and authority work',
      '## Response' || chr(10) || '- Business-day acknowledgment for inbound questions' || chr(10) || chr(10) || '## Reporting' || chr(10) || '- Monthly roll-up of rankings, traffic, and conversions tied to agreed KPIs',
      '[{"title":"Technical SEO audit","summary":"Full-site crawl issues, schema, and internal linking map."},{"title":"Content calendar","summary":"Topic clusters aligned to revenue pages."}]'
    ),
    (
      'paid-media',
      '## Account setup' || chr(10) || '- Tracking, audiences, and naming conventions' || chr(10) || chr(10) || '## Learning phase' || chr(10) || '- Controlled spend while models stabilize' || chr(10) || chr(10) || '## Scale' || chr(10) || '- Budget ladders with guardrails on CPA/ROAS',
      '## Platforms' || chr(10) || '- Google Ads and Meta unless scoped otherwise' || chr(10) || chr(10) || '## Optimization cadence' || chr(10) || '- Weekly bid/budget checks; biweekly strategic readouts',
      '[{"title":"Search consolidation","summary":"Merged duplicate campaigns and cut wasted spend by 30% in 6 weeks."}]'
    ),
    (
      'content-creative',
      '## Positioning' || chr(10) || '- Messaging hierarchy and proof points' || chr(10) || chr(10) || '## Production' || chr(10) || '- Landing pages, ads, and nurture assets' || chr(10) || chr(10) || '## Test & learn' || chr(10) || '- Structured experiments on headlines and offers',
      '## Revisions' || chr(10) || '- Two revision rounds per major asset unless otherwise scoped' || chr(10) || chr(10) || '## Turnaround' || chr(10) || '- Agreed milestones per sprint (typically 2-week slices)',
      '[{"title":"Launch narrative","summary":"Single story across paid, organic, and sales decks."}]'
    ),
    (
      'analytics',
      '## Instrumentation' || chr(10) || '- Events, conversions, and data layer hygiene' || chr(10) || chr(10) || '## Dashboards' || chr(10) || '- Executive view + channel drill-downs' || chr(10) || chr(10) || '## Insights loop' || chr(10) || '- Hypothesis backlog fed from data reviews',
      '## Data quality' || chr(10) || '- Monthly anomaly checks and documentation of definitions' || chr(10) || chr(10) || '## Access' || chr(10) || '- Role-appropriate views; no PII in shared exports',
      '[{"title":"Attribution workshop","summary":"Aligned marketing and finance on pipeline source definitions."}]'
    )
) as e (slug, roadmap, sla, examples)
where marketing_services.slug = e.slug;

-- ---------------------------------------------------------------------------
-- consult_requests: optional service + consent timestamp
-- ---------------------------------------------------------------------------
alter table public.consult_requests
  add column marketing_service_id uuid references public.marketing_services (id) on delete set null,
  add column privacy_consent_at timestamptz;

comment on column public.consult_requests.marketing_service_id is 'Service context when user started from a service or consult?service=; null for generic consult/home contact.';
comment on column public.consult_requests.privacy_consent_at is 'Set when user accepts contact/privacy checkbox on submit.';
