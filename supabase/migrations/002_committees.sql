-- Committees migration for EXISTING IANLP databases
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
  ('55555555-5555-5555-5555-000000000001', 1, 'pc_chair', null, null, true),
  ('55555555-5555-5555-5555-000000000002', 2, 'pc_chair', null, null, true),
  ('55555555-5555-5555-5555-000000000003', 3, 'pc_chair', null, null, true),
  ('55555555-5555-5555-5555-000000000004', 4, 'pc_chair', null, null, true),
  ('55555555-5555-5555-5555-000000000005', 5, 'pc_chair', null, null, true),
  ('55555555-5555-5555-5555-000000000006', 6, 'pc_chair', null, null, true),
  ('55555555-5555-5555-5555-000000000007', 7, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000008', 8, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000009', 9, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000010', 10, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000011', 11, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000012', 12, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000013', 13, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000014', 14, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000015', 15, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000016', 16, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000017', 17, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000018', 18, 'reviewer', null, null, true),
  ('55555555-5555-5555-5555-000000000019', 19, 'organizing', 'user-round', 'omar.zahour@univh2c.ma', true),
  ('55555555-5555-5555-5555-000000000020', 20, 'organizing', 'building-2', null, true)
on conflict (id) do nothing;

insert into public.committee_member_translations (member_id, locale, name, affiliation, role_label) values
  ('55555555-5555-5555-5555-000000000001', 'en', 'Prof. Omar Zahour', 'Faculty of Sciences Ben M''Sick (FSBM), Hassan II University of Casablanca, Morocco', ''),
  ('55555555-5555-5555-5555-000000000002', 'en', 'Prof. El Habib Benlahmar', 'Faculty of Sciences Ben M''Sick (FSBM), Hassan II University of Casablanca, Morocco', ''),
  ('55555555-5555-5555-5555-000000000003', 'en', 'Prof. Jaouad Dabounou', 'Hassan I University, Morocco', ''),
  ('55555555-5555-5555-5555-000000000004', 'en', 'Prof. Ángel Ruiz Zafra', 'University of Granada, Spain', ''),
  ('55555555-5555-5555-5555-000000000005', 'en', 'Prof. Fatima Zahra Fagroud', 'Chouaib Doukkali University, Morocco', ''),
  ('55555555-5555-5555-5555-000000000006', 'en', 'Prof. Hicham Toumi', 'Chouaib Doukkali University, Morocco', ''),
  ('55555555-5555-5555-5555-000000000007', 'en', 'Prof. Leila Alem', 'University of Technology Sydney, Australia', ''),
  ('55555555-5555-5555-5555-000000000008', 'en', 'Prof. Arbi Adene', 'University of Carthage, Tunisia', ''),
  ('55555555-5555-5555-5555-000000000009', 'en', 'Prof. Medhat Mahmoud', 'Expert Technologie, Cairo, Egypt', ''),
  ('55555555-5555-5555-5555-000000000010', 'en', 'Prof. Ángel Ruiz Zafra', 'University of Granada, Spain', ''),
  ('55555555-5555-5555-5555-000000000011', 'en', 'Dr. Kawtar Benghazi Akhlaki Sekkate', 'University of Granada, Spain', ''),
  ('55555555-5555-5555-5555-000000000012', 'en', 'Prof. Olivier Debauche', 'University of Liège, Belgium', ''),
  ('55555555-5555-5555-5555-000000000013', 'en', 'Prof. Anderson Rocha', 'University of Campinas (UNICAMP), Brazil', ''),
  ('55555555-5555-5555-5555-000000000014', 'en', 'Prof. Mamadou Lamine Gueye', 'University of Pau and Pays de l''Adour, France', ''),
  ('55555555-5555-5555-5555-000000000015', 'en', 'Prof. Michael Kikomba Kahungu', 'ISP-Gombe, DR Congo', ''),
  ('55555555-5555-5555-5555-000000000016', 'en', 'Prof. Mu''azu Muhammed Bashir', 'Ahmadu Bello University, Nigeria', ''),
  ('55555555-5555-5555-5555-000000000017', 'en', 'Prof. Mohammed Mestari', 'ENSET Mohammedia, Hassan II University, Morocco', ''),
  ('55555555-5555-5555-5555-000000000018', 'en', 'Prof. Rachid Saadane', 'Hassan II University of Casablanca, Morocco', ''),
  ('55555555-5555-5555-5555-000000000019', 'en', 'Prof. Omar Zahour', 'Faculty of Sciences Ben M''Sick (FSBM), Hassan II University of Casablanca, Morocco', 'General Chair'),
  ('55555555-5555-5555-5555-000000000020', 'en', 'AM2I & LTIM & FSBM', 'Hassan II University of Casablanca, Bd Commandant Driss Al Harti, Casablanca 20670, Morocco', 'Organizing Institution'),
  ('55555555-5555-5555-5555-000000000001', 'fr', 'Pr. Omar Zahour', 'Faculté des sciences Ben M''Sick (FSBM), Université Hassan II de Casablanca, Maroc', ''),
  ('55555555-5555-5555-5555-000000000002', 'fr', 'Pr. El Habib Benlahmar', 'Faculté des sciences Ben M''Sick (FSBM), Université Hassan II de Casablanca, Maroc', ''),
  ('55555555-5555-5555-5555-000000000003', 'fr', 'Pr. Jaouad Dabounou', 'Université Hassan I, Maroc', ''),
  ('55555555-5555-5555-5555-000000000004', 'fr', 'Pr. Ángel Ruiz Zafra', 'Université de Grenade, Espagne', ''),
  ('55555555-5555-5555-5555-000000000005', 'fr', 'Pr. Fatima Zahra Fagroud', 'Université Chouaib Doukkali, Maroc', ''),
  ('55555555-5555-5555-5555-000000000006', 'fr', 'Pr. Hicham Toumi', 'Université Chouaib Doukkali, Maroc', ''),
  ('55555555-5555-5555-5555-000000000007', 'fr', 'Prof. Leila Alem', 'University of Technology Sydney, Australie', ''),
  ('55555555-5555-5555-5555-000000000008', 'fr', 'Prof. Arbi Adene', 'Université de Carthage, Tunisie', ''),
  ('55555555-5555-5555-5555-000000000009', 'fr', 'Prof. Medhat Mahmoud', 'Expert Technologie, Le Caire, Égypte', ''),
  ('55555555-5555-5555-5555-000000000010', 'fr', 'Prof. Ángel Ruiz Zafra', 'Université de Grenade, Espagne', ''),
  ('55555555-5555-5555-5555-000000000011', 'fr', 'Dr. Kawtar Benghazi Akhlaki Sekkate', 'Université de Grenade, Espagne', ''),
  ('55555555-5555-5555-5555-000000000012', 'fr', 'Prof. Olivier Debauche', 'Université de Liège, Belgique', ''),
  ('55555555-5555-5555-5555-000000000013', 'fr', 'Prof. Anderson Rocha', 'Université de Campinas (UNICAMP), Brésil', ''),
  ('55555555-5555-5555-5555-000000000014', 'fr', 'Prof. Mamadou Lamine Gueye', 'Université de Pau et des Pays de l''Adour, France', ''),
  ('55555555-5555-5555-5555-000000000015', 'fr', 'Prof. Michael Kikomba Kahungu', 'ISP-Gombe, RD Congo', ''),
  ('55555555-5555-5555-5555-000000000016', 'fr', 'Prof. Mu''azu Muhammed Bashir', 'Université Ahmadu Bello, Nigeria', ''),
  ('55555555-5555-5555-5555-000000000017', 'fr', 'Prof. Mohammed Mestari', 'ENSET Mohammedia, Université Hassan II, Maroc', ''),
  ('55555555-5555-5555-5555-000000000018', 'fr', 'Prof. Rachid Saadane', 'Université Hassan II de Casablanca, Maroc', ''),
  ('55555555-5555-5555-5555-000000000019', 'fr', 'Pr. Omar Zahour', 'Faculté des sciences Ben M''Sick (FSBM), Université Hassan II de Casablanca, Maroc', 'Président général'),
  ('55555555-5555-5555-5555-000000000020', 'fr', 'AM2I et FSBM', 'Université Hassan II de Casablanca, Bd Commandant Driss Al Harti, Casablanca 20670, Maroc', 'Institution organisatrice'),
  ('55555555-5555-5555-5555-000000000001', 'ar', 'أ.د. عمر زهور', 'كلية العلوم بن مسيك (FSBM)، جامعة الحسن الثاني بالدار البيضاء، المغرب', ''),
  ('55555555-5555-5555-5555-000000000002', 'ar', 'أ.د. الحبيب بن الحمر', 'كلية العلوم بن مسيك (FSBM)، جامعة الحسن الثاني بالدار البيضاء، المغرب', ''),
  ('55555555-5555-5555-5555-000000000003', 'ar', 'أ.د. جواد ديبونو', 'جامعة الحسن الأول، المغرب', ''),
  ('55555555-5555-5555-5555-000000000004', 'ar', 'أ.د. أنخيل رويز زافرا', 'جامعة غرناطة، إسبانيا', ''),
  ('55555555-5555-5555-5555-000000000005', 'ar', 'أ.د. فاطمة الزهراء فقروج', 'جامعة شعيب الدكالي، المغرب', ''),
  ('55555555-5555-5555-5555-000000000006', 'ar', 'أ.د. هشام تومي', 'جامعة شعيب الدكالي، المغرب', ''),
  ('55555555-5555-5555-5555-000000000007', 'ar', 'أ.د. ليلى علم', 'جامعة تكنولوجيا سيدني، أستراليا', ''),
  ('55555555-5555-5555-5555-000000000008', 'ar', 'أ.د. عربي عادان', 'جامعة قرطاج، تونس', ''),
  ('55555555-5555-5555-5555-000000000009', 'ar', 'أ.د. مدحت محمود', 'إكسبيرت تكنولوجي، القاهرة، مصر', ''),
  ('55555555-5555-5555-5555-000000000010', 'ar', 'أ.د. أنخيل رويز زافرا', 'جامعة غرناطة، إسبانيا', ''),
  ('55555555-5555-5555-5555-000000000011', 'ar', 'د. قطَر بنغازي أخلاقي سكاط', 'جامعة غرناطة، إسبانيا', ''),
  ('55555555-5555-5555-5555-000000000012', 'ar', 'أ.د. أوليفييه ديبوش', 'جامعة لِييج، بلجيكا', ''),
  ('55555555-5555-5555-5555-000000000013', 'ar', 'أ.د. أندرسون روشا', 'جامعة كامبيناس (UNICAMP)، البرازيل', ''),
  ('55555555-5555-5555-5555-000000000014', 'ar', 'أ.د. مامادو لامين غي', 'جامعة باو وبحوض الأدور، فرنسا', ''),
  ('55555555-5555-5555-5555-000000000015', 'ar', 'أ.د. مايكل كيكومبا كاهونغو', 'ISP-غومبي، الكونغو الديمقراطية', ''),
  ('55555555-5555-5555-5555-000000000016', 'ar', 'أ.د. مؤازو محمد بشير', 'جامعة أحمدو بيلو، نيجيريا', ''),
  ('55555555-5555-5555-5555-000000000017', 'ar', 'أ.د. محمد مستاري', 'ENSET المحمدية، جامعة الحسن الثاني، المغرب', ''),
  ('55555555-5555-5555-5555-000000000018', 'ar', 'أ.د. رشيد سعدان', 'جامعة الحسن الثاني بالدار البيضاء، المغرب', ''),
  ('55555555-5555-5555-5555-000000000019', 'ar', 'أ.د. عمر زهور', 'كلية العلوم بن مسيك (FSBM)، جامعة الحسن الثاني بالدار البيضاء، المغرب', 'الرئيس العام'),
  ('55555555-5555-5555-5555-000000000020', 'ar', 'AM2I و FSBM', 'جامعة الحسن الثاني بالدار البيضاء، شارع القائد دريس الحارتي، الدار البيضاء 20670، المغرب', 'المؤسسة المنظمة')
on conflict (member_id, locale) do nothing;
