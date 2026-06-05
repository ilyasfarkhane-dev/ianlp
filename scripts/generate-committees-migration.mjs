/**
 * Generates supabase/migrations/002_committees.sql from messages/*.json
 * Run: node scripts/generate-committees-migration.mjs
 */

import fs from 'fs'
import path from 'path'

const root = path.resolve(import.meta.dirname, '..')
const messages = {
  en: JSON.parse(fs.readFileSync(path.join(root, 'messages/en.json'), 'utf8')).committees,
  fr: JSON.parse(fs.readFileSync(path.join(root, 'messages/fr.json'), 'utf8')).committees,
  ar: JSON.parse(fs.readFileSync(path.join(root, 'messages/ar.json'), 'utf8')).committees,
}

function esc(value) {
  return String(value).replace(/'/g, "''")
}

function id(n) {
  return `'55555555-5555-5555-5555-${String(n).padStart(12, '0')}'`
}

const members = []

for (let i = 1; i <= 6; i++) {
  members.push({
    id: i,
    sort: i,
    type: 'pc_chair',
    icon: null,
    email: null,
    keys: { name: `pcChair${i}`, affiliation: `pcChair${i}Aff`, roleLabel: '' },
  })
}

for (let i = 1; i <= 12; i++) {
  members.push({
    id: 6 + i,
    sort: 6 + i,
    type: 'reviewer',
    icon: null,
    email: null,
    keys: { name: `reviewer${i}Name`, affiliation: `reviewer${i}Aff`, roleLabel: '' },
  })
}

members.push({
  id: 19,
  sort: 19,
  type: 'organizing',
  icon: 'user-round',
  email: 'omar.zahour@univh2c.ma',
  keys: { name: 'profOmar', affiliation: 'fsbmH2c', roleLabel: 'generalChair' },
})

members.push({
  id: 20,
  sort: 20,
  type: 'organizing',
  icon: 'building-2',
  email: null,
  keys: { name: 'am2iFsbm', affiliation: 'h2cAddress', roleLabel: 'organizingInstitution' },
})

const memberRows = members
  .map((m) => {
    const icon = m.icon ? `'${m.icon}'` : 'null'
    const email = m.email ? `'${esc(m.email)}'` : 'null'
    return `  (${id(m.id)}, ${m.sort}, '${m.type}', ${icon}, ${email}, true)`
  })
  .join(',\n')

const translationRows = []
for (const locale of ['en', 'fr', 'ar']) {
  for (const member of members) {
    const t = messages[locale]
    translationRows.push(
      `  (${id(member.id)}, '${locale}', '${esc(t[member.keys.name])}', '${esc(t[member.keys.affiliation])}', '${esc(member.keys.roleLabel ? t[member.keys.roleLabel] : '')}')`
    )
  }
}

const sql = `-- Committees migration for EXISTING IANLP databases
-- Safe to re-run. Generated from messages/*.json
-- Run in Supabase Dashboard → SQL → New query

create extension if not exists "pgcrypto";

do $$ begin
  create type public.committee_type as enum ('pc_chair', 'reviewer', 'organizing');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.committee_members (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  committee_type public.committee_type not null default 'pc_chair',
  icon text,
  email text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.committee_member_translations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.committee_members(id) on delete cascade,
  locale public.locale not null,
  name text not null,
  affiliation text not null default '',
  role_label text not null default '',
  unique (member_id, locale)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists committee_members_updated_at on public.committee_members;
create trigger committee_members_updated_at
  before update on public.committee_members
  for each row execute function public.set_updated_at();

alter table public.committee_members enable row level security;
alter table public.committee_member_translations enable row level security;

drop policy if exists "Public read published committee members" on public.committee_members;
create policy "Public read published committee members"
  on public.committee_members for select
  using (is_published = true);

drop policy if exists "Public read committee member translations" on public.committee_member_translations;
create policy "Public read committee member translations"
  on public.committee_member_translations for select
  using (
    exists (
      select 1 from public.committee_members m
      where m.id = member_id and m.is_published = true
    )
  );

drop policy if exists "Admin full access committee members" on public.committee_members;
create policy "Admin full access committee members"
  on public.committee_members for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin full access committee member translations" on public.committee_member_translations;
create policy "Admin full access committee member translations"
  on public.committee_member_translations for all
  to authenticated
  using (true)
  with check (true);

insert into public.committee_members (id, sort_order, committee_type, icon, email, is_published) values
${memberRows}
on conflict (id) do nothing;

insert into public.committee_member_translations (member_id, locale, name, affiliation, role_label) values
${translationRows.join(',\n')}
on conflict (member_id, locale) do nothing;
`

fs.writeFileSync(path.join(root, 'supabase/migrations/002_committees.sql'), sql)
console.log('Wrote supabase/migrations/002_committees.sql')
