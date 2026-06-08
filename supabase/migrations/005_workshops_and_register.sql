-- Workshops and register page settings
-- Safe to re-run

create table if not exists public.workshops (
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

create table if not exists public.workshop_translations (
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

drop trigger if exists workshops_updated_at on public.workshops;
create trigger workshops_updated_at
  before update on public.workshops
  for each row execute function public.set_updated_at();

alter table public.workshops enable row level security;
alter table public.workshop_translations enable row level security;

drop policy if exists "Public read published workshops" on public.workshops;
create policy "Public read published workshops"
  on public.workshops for select
  using (is_published = true);

drop policy if exists "Public read workshop translations" on public.workshop_translations;
create policy "Public read workshop translations"
  on public.workshop_translations for select
  using (
    exists (
      select 1 from public.workshops w
      where w.id = workshop_id and w.is_published = true
    )
  );

drop policy if exists "Admin full access workshops" on public.workshops;
create policy "Admin full access workshops"
  on public.workshops for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin full access workshop translations" on public.workshop_translations;
create policy "Admin full access workshop translations"
  on public.workshop_translations for all
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value) values
  (
    'register',
    '{
      "pageTitle": "Registration & Workshops",
      "pageSubtitle": "Secure your place at IANLP 2026 and join our hands-on practical workshops.",
      "datesValue": "29–30 June 2026",
      "conferenceStep": "Step 1",
      "feesTitle": "Conference Registration Fees",
      "feesSubtitle": "Choose your registration type for IANLP 2026.",
      "workshopsBadge": "Practical Workshops",
      "workshopsTitle": "Workshop Registration",
      "workshopsSubtitle": "Two intensive practical sessions during IANLP 2026 — limited seats available.",
      "limitedSpots": "Limited spots",
      "helpTitle": "Need help?",
      "helpSubtitle": "Contact the IANLP 2026 organizing committee for registration questions.",
      "helpEmail": "omar.zahour@univh2c.ma"
    }'::jsonb
  )
on conflict (key) do update set
  value = public.site_settings.value || excluded.value,
  updated_at = now();

do $$
declare
  w1_id uuid;
  w2_id uuid;
  loc public.locale;
begin
  if exists (select 1 from public.workshops limit 1) then
    return;
  end if;

  insert into public.workshops (sort_order, icon, image_path, registration_url, duration, fee, is_published)
  values (
    0,
    'video',
    '/workshops/w1.jpg',
    'https://docs.google.com/forms/d/e/1FAIpQLSexlxRa97uIEUGNECvlgGkC1Qw1E2K9jaYnGFK1XCA55ZJGmg/viewform',
    '2h00',
    '200 DH',
    true
  )
  returning id into w1_id;

  insert into public.workshops (sort_order, icon, image_path, registration_url, duration, fee, is_published)
  values (
    1,
    'workflow',
    '/workshops/w2.jpg',
    'https://docs.google.com/forms/d/e/1FAIpQLSfJX-6YG7hETweSRgodTLQcABLjGvT31bJmx_3WbT80DNGfMA/viewform',
    '1h30',
    '200 DH',
    true
  )
  returning id into w2_id;

  foreach loc in array array['en'::public.locale, 'fr'::public.locale, 'ar'::public.locale]
  loop
    insert into public.workshop_translations (
      workshop_id, locale, badge_label, title, subtitle, description,
      animator, animator_role, program, audience
    ) values (
      w1_id,
      loc,
      'Workshop 1',
      'From Text to Video: Foundations, Challenges & AI Video Generation',
      'Practical Workshop 2 — IANLP 2026',
      'An introduction to text-to-video generation — exploring core principles, technical challenges, and current applications in education, communication, media, and content creation.',
      'Salma Hannouni',
      'PhD candidate, Faculty of Sciences Ben M''Sick, Hassan II University of Casablanca',
      '["Understanding the Text-to-Video pipeline","How generative AI video systems work","Hands-on experimentation with video generation tools","Analyzing results and discussing current limitations"]'::jsonb,
      'Students, PhD candidates, researchers, teachers, professionals, entrepreneurs, and anyone interested in AI video content creation.'
    );

    insert into public.workshop_translations (
      workshop_id, locale, badge_label, title, subtitle, description,
      animator, animator_role, program, audience
    ) values (
      w2_id,
      loc,
      'Workshop 2',
      'No-Code AI Automation Lab: Intelligent Workflows with n8n & Google Opal',
      'Practical Workshop — IANLP 2026',
      'Learn to design, automate, and deploy intelligent no-code workflows using n8n, Google Opal, and generative AI — for scientific monitoring, document summarization, file classification, report generation, and smart assistants.',
      'Dr. Laila El-JIANI',
      'PhD in AI — Data Scientist, AI and IT Professional Trainer',
      '["Principles of intelligent automation","Introduction to n8n and Google Opal","Building end-to-end AI workflows","Use cases for education, research, business, and healthcare"]'::jsonb,
      'Students, PhD candidates, teachers, researchers, engineers, professionals, and anyone interested in no-code intelligent automation.'
    );
  end loop;
end $$;
