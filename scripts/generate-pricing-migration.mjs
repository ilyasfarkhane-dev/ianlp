/**
 * Generates supabase/migrations/003_pricing.sql from messages/*.json
 * Run: node scripts/generate-pricing-migration.mjs
 */

import fs from 'fs'
import path from 'path'

const root = path.resolve(import.meta.dirname, '..')
const messages = {
  en: JSON.parse(fs.readFileSync(path.join(root, 'messages/en.json'), 'utf8')).pricing,
  fr: JSON.parse(fs.readFileSync(path.join(root, 'messages/fr.json'), 'utf8')).pricing,
  ar: JSON.parse(fs.readFileSync(path.join(root, 'messages/ar.json'), 'utf8')).pricing,
}

function esc(value) {
  return String(value).replace(/'/g, "''")
}

function featuresJson(locale, prefix, count) {
  const items = []
  for (let i = 1; i <= count; i++) {
    items.push(messages[locale][`${prefix}Feature${i}`])
  }
  return JSON.stringify(items).replace(/'/g, "''")
}

const tiers = [
  { id: 1, sort: 1, price: '300', featured: true, nameKey: 'inPersonName', prefix: 'inPerson', featureCount: 9 },
  { id: 2, sort: 2, price: '150', featured: false, nameKey: 'distanceName', prefix: 'distance', featureCount: 3 },
]

const tierRows = tiers
  .map((t) => {
    const id = `'66666666-6666-6666-6666-${String(t.id).padStart(12, '0')}'`
    return `  (${id}, ${t.sort}, '${t.price}', 'MAD', ${t.featured}, true)`
  })
  .join(',\n')

const translationRows = []
for (const locale of ['en', 'fr', 'ar']) {
  for (const tier of tiers) {
    const id = `'66666666-6666-6666-6666-${String(tier.id).padStart(12, '0')}'`
    translationRows.push(
      `  (${id}, '${locale}', '${esc(messages[locale][tier.nameKey])}', '${featuresJson(locale, tier.prefix, tier.featureCount)}'::jsonb)`
    )
  }
}

const sql = `-- Pricing tiers migration for EXISTING IANLP databases
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
${tierRows}
on conflict (id) do nothing;

insert into public.pricing_tier_translations (tier_id, locale, name, features) values
${translationRows.join(',\n')}
on conflict (tier_id, locale) do nothing;
`

fs.writeFileSync(path.join(root, 'supabase/migrations/003_pricing.sql'), sql)
console.log('Wrote supabase/migrations/003_pricing.sql')
