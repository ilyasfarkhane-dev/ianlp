-- Pricing tiers migration for EXISTING IANLP databases
-- Safe to re-run. Generated from messages/*.json

create extension if not exists "pgcrypto";

create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  price text not null,
  currency text not null default 'MAD',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_tier_translations (
  id uuid primary key default gen_random_uuid(),
  tier_id uuid not null references public.pricing_tiers(id) on delete cascade,
  locale public.locale not null,
  name text not null,
  features jsonb not null default '[]'::jsonb,
  unique (tier_id, locale)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists pricing_tiers_updated_at on public.pricing_tiers;
create trigger pricing_tiers_updated_at
  before update on public.pricing_tiers
  for each row execute function public.set_updated_at();

alter table public.pricing_tiers enable row level security;
alter table public.pricing_tier_translations enable row level security;

drop policy if exists "Public read published pricing tiers" on public.pricing_tiers;
create policy "Public read published pricing tiers"
  on public.pricing_tiers for select
  using (is_published = true);

drop policy if exists "Public read pricing tier translations" on public.pricing_tier_translations;
create policy "Public read pricing tier translations"
  on public.pricing_tier_translations for select
  using (
    exists (
      select 1 from public.pricing_tiers p
      where p.id = tier_id and p.is_published = true
    )
  );

drop policy if exists "Admin full access pricing tiers" on public.pricing_tiers;
create policy "Admin full access pricing tiers"
  on public.pricing_tiers for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin full access pricing tier translations" on public.pricing_tier_translations;
create policy "Admin full access pricing tier translations"
  on public.pricing_tier_translations for all
  to authenticated
  using (true)
  with check (true);

insert into public.pricing_tiers (id, sort_order, price, currency, is_featured, is_published) values
  ('66666666-6666-6666-6666-000000000001', 1, '300', 'MAD', true, true),
  ('66666666-6666-6666-6666-000000000002', 2, '150', 'MAD', false, true)
on conflict (id) do nothing;

insert into public.pricing_tier_translations (tier_id, locale, name, features) values
  ('66666666-6666-6666-6666-000000000001', 'en', 'In-Person', '["Communication Certificate","Certificate of Participation","Conference Materials","Access to Exhibitions","Lunch and Tea/Coffee Breaks","Conference Documents","Briefcase | Proceedings Report","Notebook | Pen","Badge | Brochure | Program"]'::jsonb),
  ('66666666-6666-6666-6666-000000000002', 'en', 'Distance', '["Communication Certificate","Certificate of Participation","Conference Documents"]'::jsonb),
  ('66666666-6666-6666-6666-000000000001', 'fr', 'Présentiel', '["Certificat de communication","Certificat de participation","Matériel de conférence","Accès aux expositions","Déjeuner et pauses thé/café","Documents de conférence","Mallette | Rapport des actes","Carnet | Stylo","Badge | Brochure | Programme"]'::jsonb),
  ('66666666-6666-6666-6666-000000000002', 'fr', 'À distance', '["Certificat de communication","Certificat de participation","Documents de conférence"]'::jsonb),
  ('66666666-6666-6666-6666-000000000001', 'ar', 'حضوري', '["شهادة التواصل","شهادة المشاركة","مواد المؤتمر","الوصول إلى المعارض","الغداء واستراحات الشاي/القهوة","وثائق المؤتمر","حقيبة | تقرير وقائع","دفتر | قلم","شارة | كتيب | البرنامج"]'::jsonb),
  ('66666666-6666-6666-6666-000000000002', 'ar', 'عن بُعد', '["شهادة التواصل","شهادة المشاركة","وثائق المؤتمر"]'::jsonb)
on conflict (tier_id, locale) do nothing;
