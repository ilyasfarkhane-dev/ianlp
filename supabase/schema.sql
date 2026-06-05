-- IANLP Admin Dashboard — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
create type public.locale as enum ('en', 'fr', 'ar');
create type public.speaker_category as enum ('keynote', 'invited');
create type public.date_tab as enum ('submission', 'review', 'conference');

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
  ('contact', '{"email":"omar.zahour@univh2c.ma","phone":"+212660082091"}'::jsonb),
  ('links', '{"easychair":"https://easychair.org/conferences/?conf=ianlp2026","springerTemplate":"https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"}'::jsonb)
on conflict (key) do nothing;
