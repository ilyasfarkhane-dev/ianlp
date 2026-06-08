-- IANLP Admin Dashboard — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Extensions
create extension if not exists "pgcrypto";

-- Enums (skip if already created)
do $$ begin
  create type public.locale as enum ('en', 'fr', 'ar');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.speaker_category as enum ('keynote', 'invited');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.date_tab as enum ('submission', 'review', 'conference');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.topic_type as enum ('main', 'focus');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.committee_type as enum ('pc_chair', 'reviewer', 'organizing');
exception when duplicate_object then null;
end $$;

-- Speakers
create table public.speakers (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  image_path text,
  category public.speaker_category not null default 'keynote',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.speaker_translations (
  id uuid primary key default gen_random_uuid(),
  speaker_id uuid not null references public.speakers(id) on delete cascade,
  locale public.locale not null,
  name text not null,
  affiliation text not null default '',
  bio text not null default '',
  unique (speaker_id, locale)
);

-- Important dates
create table public.important_dates (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  tab public.date_tab not null default 'submission',
  date_value text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.important_date_translations (
  id uuid primary key default gen_random_uuid(),
  date_id uuid not null references public.important_dates(id) on delete cascade,
  locale public.locale not null,
  label text not null,
  description text not null default '',
  unique (date_id, locale)
);

-- Partners
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  logo_path text not null,
  url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partner_translations (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  locale public.locale not null,
  alt_text text not null,
  unique (partner_id, locale)
);

-- Topics (main thematic areas + special focus cards)
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  topic_type public.topic_type not null default 'main',
  icon text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.topic_translations (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  locale public.locale not null,
  title text not null,
  description text not null default '',
  unique (topic_id, locale)
);

-- Committee members
create table public.committee_members (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  committee_type public.committee_type not null default 'pc_chair',
  icon text,
  email text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.committee_member_translations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.committee_members(id) on delete cascade,
  locale public.locale not null,
  name text not null,
  affiliation text not null default '',
  role_label text not null default '',
  unique (member_id, locale)
);

-- Pricing tiers
create table public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  price text not null,
  currency text not null default 'MAD',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pricing_tier_translations (
  id uuid primary key default gen_random_uuid(),
  tier_id uuid not null references public.pricing_tiers(id) on delete cascade,
  locale public.locale not null,
  name text not null,
  features jsonb not null default '[]'::jsonb,
  unique (tier_id, locale)
);

-- Workshops (register page)
create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  icon text not null default 'video',
  image_path text,
  registration_url text not null,
  duration text not null,
  fee text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workshop_translations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  locale public.locale not null,
  badge_label text not null default '',
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  animator text not null default '',
  animator_role text not null default '',
  program jsonb not null default '[]'::jsonb,
  audience text not null default '',
  unique (workshop_id, locale)
);

-- Site settings (key-value store)
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger speakers_updated_at
  before update on public.speakers
  for each row execute function public.set_updated_at();

create trigger important_dates_updated_at
  before update on public.important_dates
  for each row execute function public.set_updated_at();

create trigger partners_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

create trigger topics_updated_at
  before update on public.topics
  for each row execute function public.set_updated_at();

create trigger committee_members_updated_at
  before update on public.committee_members
  for each row execute function public.set_updated_at();

create trigger pricing_tiers_updated_at
  before update on public.pricing_tiers
  for each row execute function public.set_updated_at();

create trigger workshops_updated_at
  before update on public.workshops
  for each row execute function public.set_updated_at();

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.speakers enable row level security;
alter table public.speaker_translations enable row level security;
alter table public.important_dates enable row level security;
alter table public.important_date_translations enable row level security;
alter table public.partners enable row level security;
alter table public.partner_translations enable row level security;
alter table public.topics enable row level security;
alter table public.topic_translations enable row level security;
alter table public.committee_members enable row level security;
alter table public.committee_member_translations enable row level security;
alter table public.pricing_tiers enable row level security;
alter table public.pricing_tier_translations enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_translations enable row level security;
alter table public.site_settings enable row level security;

-- Public read for published content (website)
create policy "Public read published speakers"
  on public.speakers for select
  using (is_published = true);

create policy "Public read speaker translations"
  on public.speaker_translations for select
  using (
    exists (
      select 1 from public.speakers s
      where s.id = speaker_id and s.is_published = true
    )
  );

create policy "Public read published dates"
  on public.important_dates for select
  using (is_published = true);

create policy "Public read date translations"
  on public.important_date_translations for select
  using (
    exists (
      select 1 from public.important_dates d
      where d.id = date_id and d.is_published = true
    )
  );

create policy "Public read published partners"
  on public.partners for select
  using (is_published = true);

create policy "Public read partner translations"
  on public.partner_translations for select
  using (
    exists (
      select 1 from public.partners p
      where p.id = partner_id and p.is_published = true
    )
  );

create policy "Public read published topics"
  on public.topics for select
  using (is_published = true);

create policy "Public read topic translations"
  on public.topic_translations for select
  using (
    exists (
      select 1 from public.topics t
      where t.id = topic_id and t.is_published = true
    )
  );

create policy "Public read published committee members"
  on public.committee_members for select
  using (is_published = true);

create policy "Public read committee member translations"
  on public.committee_member_translations for select
  using (
    exists (
      select 1 from public.committee_members m
      where m.id = member_id and m.is_published = true
    )
  );

create policy "Public read published pricing tiers"
  on public.pricing_tiers for select
  using (is_published = true);

create policy "Public read pricing tier translations"
  on public.pricing_tier_translations for select
  using (
    exists (
      select 1 from public.pricing_tiers p
      where p.id = tier_id and p.is_published = true
    )
  );

create policy "Public read published workshops"
  on public.workshops for select
  using (is_published = true);

create policy "Public read workshop translations"
  on public.workshop_translations for select
  using (
    exists (
      select 1 from public.workshops w
      where w.id = workshop_id and w.is_published = true
    )
  );

create policy "Public read site settings"
  on public.site_settings for select
  using (true);

-- Authenticated admin full access
create policy "Admin full access speakers"
  on public.speakers for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access speaker translations"
  on public.speaker_translations for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access important_dates"
  on public.important_dates for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access important_date_translations"
  on public.important_date_translations for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access partners"
  on public.partners for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access partner_translations"
  on public.partner_translations for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access topics"
  on public.topics for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access topic translations"
  on public.topic_translations for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access committee members"
  on public.committee_members for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access committee member translations"
  on public.committee_member_translations for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access pricing tiers"
  on public.pricing_tiers for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access pricing tier translations"
  on public.pricing_tier_translations for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access workshops"
  on public.workshops for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access workshop translations"
  on public.workshop_translations for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access site_settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for uploads (optional — run in Storage settings or via API)
-- insert into storage.buckets (id, name, public) values ('media', 'media', true);

-- Default site settings
insert into public.site_settings (key, value) values
  ('conference', '{"countdownDate":"2026-06-29T09:00:00","startDate":"June 29-30, 2026","venue":"Faculty of Sciences Ben M''Sick (FSBM)"}'::jsonb),
  ('contact', '{"email":"omar.zahour@univh2c.ma","phone":"+212660082091","phoneDisplay":"+212 6 60 08 20 91","address":"Faculty of Sciences Ben M''Sick (FSBM), Hassan II University of Casablanca, Bd Commandant Driss Al Harti, Casablanca 20670, Morocco","generalChairName":"Prof. Omar Zahour","chairAffiliationPrimary":"Faculty of Sciences Ben M''Sick (FSBM)","chairAffiliationSecondary":"Hassan II University of Casablanca"}'::jsonb),
  ('links', '{"easychair":"https://easychair.org/conferences/?conf=ianlp2026","springerTemplate":"https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"}'::jsonb),
  ('register', '{"pageTitle":"Registration & Workshops","pageSubtitle":"Secure your place at IANLP 2026 and join our hands-on practical workshops.","datesValue":"29–30 June 2026","conferenceStep":"Step 1","feesTitle":"Conference Registration Fees","feesSubtitle":"Choose your registration type for IANLP 2026.","workshopsBadge":"Practical Workshops","workshopsTitle":"Workshop Registration","workshopsSubtitle":"Two intensive practical sessions during IANLP 2026 — limited seats available.","limitedSpots":"Limited spots","helpTitle":"Need help?","helpSubtitle":"Contact the IANLP 2026 organizing committee for registration questions.","helpEmail":"omar.zahour@univh2c.ma"}'::jsonb)
on conflict (key) do nothing;
