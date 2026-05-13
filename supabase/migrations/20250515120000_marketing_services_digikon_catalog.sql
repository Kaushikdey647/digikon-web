-- Replace marketing_services with Digikon full-service catalog.
-- consult_requests.marketing_service_id uses ON DELETE SET NULL.

delete from public.marketing_services;

insert into public.marketing_services (
  title,
  description,
  icon_key,
  sort_order,
  slug,
  home_featured_rank,
  roadmap_md,
  sla_md,
  examples
)
values
  (
    'Social Media Handling',
    'Creative calendars, community management, and campaigns that fit your brand voice.',
    'Share2',
    10,
    'social-media-handling',
    1,
    '## Scope' || chr(10) || '- Channel strategy, content pillars, and posting cadence' || chr(10) || chr(10) || '## Execution' || chr(10) || '- Assets, publishing, and performance snapshots',
    '## Cadence' || chr(10) || '- Agreed response windows and escalation path' || chr(10) || chr(10) || '## Reporting' || chr(10) || '- Monthly readout with next experiments',
    '[]'::jsonb
  ),
  (
    'Content Marketing',
    'Story-led blogs, landing copy, and nurture journeys that move people to action.',
    'PenLine',
    20,
    'content-marketing',
    2,
    '## Discovery' || chr(10) || '- Audience insights and message hierarchy' || chr(10) || chr(10) || '## Production' || chr(10) || '- Editorial calendar and asset delivery' || chr(10) || chr(10) || '## Distribution' || chr(10) || '- Channel-specific packaging and tests',
    '## Revisions' || chr(10) || '- Two revision rounds per major asset unless scoped otherwise' || chr(10) || chr(10) || '## Turnaround' || chr(10) || '- Milestones agreed per sprint',
    '[]'::jsonb
  ),
  (
    'SEO',
    'Technical health, topical authority, and sustainable organic visibility.',
    'Search',
    30,
    'seo',
    3,
    '## Baseline' || chr(10) || '- Crawl, indexation, and Core Web Vitals review' || chr(10) || chr(10) || '## Roadmap' || chr(10) || '- Quick wins then sustained content and authority work' || chr(10) || chr(10) || '## Measurement' || chr(10) || '- Rankings, traffic, and conversion tie-ins',
    '## Reporting' || chr(10) || '- Monthly roll-up against agreed KPIs' || chr(10) || chr(10) || '## Collaboration' || chr(10) || '- Clear handoffs with dev and content owners',
    '[]'::jsonb
  ),
  (
    'Automation',
    'Workflows, integrations, and lifecycle triggers that save time and lift conversion.',
    'Workflow',
    40,
    'automation',
    null,
    '## Map' || chr(10) || '- Systems, data sources, and manual steps to remove' || chr(10) || chr(10) || '## Build' || chr(10) || '- Reliable automations with logging and fallbacks' || chr(10) || chr(10) || '## Operate' || chr(10) || '- Monitoring, alerts, and iteration backlog',
    '## Quality' || chr(10) || '- Test plans before go-live' || chr(10) || chr(10) || '## Access' || chr(10) || '- Least-privilege credentials and documentation',
    '[]'::jsonb
  ),
  (
    'Website Designing',
    'Fast, accessible sites that reflect your brand and support your funnel.',
    'Globe2',
    50,
    'website-designing',
    null,
    '## UX' || chr(10) || '- Structure, wireframes, and conversion paths' || chr(10) || chr(10) || '## Build' || chr(10) || '- Responsive layouts and performance budgets' || chr(10) || chr(10) || '## Launch' || chr(10) || '- QA, analytics, and handover',
    '## Browser support' || chr(10) || '- Scoped per project' || chr(10) || chr(10) || '## Maintenance' || chr(10) || '- Optional retainers for updates',
    '[]'::jsonb
  ),
  (
    'Graphic Designing',
    'Brand systems, social kits, decks, and print-ready assets.',
    'Palette',
    60,
    'graphic-designing',
    null,
    '## Direction' || chr(10) || '- Mood, references, and brand guardrails' || chr(10) || chr(10) || '## Design' || chr(10) || '- Iterations with consolidated feedback' || chr(10) || chr(10) || '## Delivery' || chr(10) || '- Source files and export specs',
    '## Revisions' || chr(10) || '- Rounds agreed per scope' || chr(10) || chr(10) || '## Licensing' || chr(10) || '- Fonts and stock cleared for intended use',
    '[]'::jsonb
  ),
  (
    'Video and Photo Editing',
    'Cuts, color, motion, and social-first formats for campaigns and launches.',
    'Clapperboard',
    70,
    'video-and-photo-editing',
    null,
    '## Pre-production' || chr(10) || '- Shot list, references, and aspect ratios' || chr(10) || chr(10) || '## Post' || chr(10) || '- Edit passes, sound, and captions' || chr(10) || chr(10) || '## Delivery' || chr(10) || '- Platform-specific exports',
    '## Assets' || chr(10) || '- Organized project files and naming conventions' || chr(10) || chr(10) || '## Rounds' || chr(10) || '- Structured review windows',
    '[]'::jsonb
  ),
  (
    'App Development',
    'Mobile and web apps scoped for usability, performance, and maintainability.',
    'Smartphone',
    80,
    'app-development',
    null,
    '## Discovery' || chr(10) || '- User journeys, constraints, and success metrics' || chr(10) || chr(10) || '## Build' || chr(10) || '- Milestone releases with test coverage' || chr(10) || chr(10) || '## Ship' || chr(10) || '- Store readiness or deployment support',
    '## SLAs' || chr(10) || '- Severity-based response targets when retained' || chr(10) || chr(10) || '## IP' || chr(10) || '- Clear ownership of code and accounts',
    '[]'::jsonb
  ),
  (
    'Ads Management',
    'Paid search, social, and display tuned for CPA, ROAS, and scale.',
    'Megaphone',
    90,
    'ads-management',
    4,
    '## Setup' || chr(10) || '- Tracking, audiences, and naming conventions' || chr(10) || chr(10) || '## Learn' || chr(10) || '- Controlled spend while models stabilize' || chr(10) || chr(10) || '## Scale' || chr(10) || '- Budget ladders with guardrails',
    '## Cadence' || chr(10) || '- Weekly optimization checks' || chr(10) || chr(10) || '## Reporting' || chr(10) || '- Fortnightly strategic readouts',
    '[]'::jsonb
  ),
  (
    'QR and Digital Menu Designing',
    'QR journeys, digital menus, and lightweight experiences guests actually use.',
    'QrCode',
   100|    100,
    'qr-digital-menu-designing',
    null,
    '## UX' || chr(10) || '- Guest flows, accessibility, and branding' || chr(10) || chr(10) || '## Build' || chr(10) || '- QR routing, menu structure, and updates' || chr(10) || chr(10) || '## Launch' || chr(10) || '- Print specs and staff training notes',
    '## Updates' || chr(10) || '- Agreed turnaround for menu changes' || chr(10) || chr(10) || '## Hosting' || chr(10) || '- Scoped per project',
    '[]'::jsonb
  );

-- Re-assign testimonials in round-robin order (same pattern as 20250507120000).
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
