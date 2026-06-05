-- Topics migration for EXISTING IANLP databases
-- Safe to re-run. Does NOT recreate locale/speaker/date enums or other tables.
-- Run in Supabase Dashboard → SQL → New query

create extension if not exists "pgcrypto";

-- New enum only (skip if already applied)
do $$ begin
  create type public.topic_type as enum ('main', 'focus');
exception
  when duplicate_object then null;
end $$;

-- Tables
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  topic_type public.topic_type not null default 'main',
  icon text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topic_translations (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  locale public.locale not null,
  title text not null,
  description text not null default '',
  unique (topic_id, locale)
);

-- Updated_at trigger (function may already exist from main schema)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists topics_updated_at on public.topics;
create trigger topics_updated_at
  before update on public.topics
  for each row execute function public.set_updated_at();

-- RLS
alter table public.topics enable row level security;
alter table public.topic_translations enable row level security;

drop policy if exists "Public read published topics" on public.topics;
create policy "Public read published topics"
  on public.topics for select
  using (is_published = true);

drop policy if exists "Public read topic translations" on public.topic_translations;
create policy "Public read topic translations"
  on public.topic_translations for select
  using (
    exists (
      select 1 from public.topics t
      where t.id = topic_id and t.is_published = true
    )
  );

drop policy if exists "Admin full access topics" on public.topics;
create policy "Admin full access topics"
  on public.topics for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin full access topic translations" on public.topic_translations;
create policy "Admin full access topic translations"
  on public.topic_translations for all
  to authenticated
  using (true)
  with check (true);

-- Seed: main thematic areas + special focus cards
insert into public.topics (id, sort_order, topic_type, icon, is_published) values
  ('44444444-4444-4444-4444-444444444401', 1, 'main', null, true),
  ('44444444-4444-4444-4444-444444444402', 2, 'main', null, true),
  ('44444444-4444-4444-4444-444444444403', 3, 'main', null, true),
  ('44444444-4444-4444-4444-444444444404', 4, 'main', null, true),
  ('44444444-4444-4444-4444-444444444405', 5, 'main', null, true),
  ('44444444-4444-4444-4444-444444444406', 6, 'main', null, true),
  ('44444444-4444-4444-4444-444444444407', 7, 'main', null, true),
  ('44444444-4444-4444-4444-444444444408', 8, 'main', null, true),
  ('44444444-4444-4444-4444-444444444409', 9, 'main', null, true),
  ('44444444-4444-4444-4444-444444444410', 10, 'main', null, true),
  ('44444444-4444-4444-4444-444444444411', 11, 'main', null, true),
  ('44444444-4444-4444-4444-444444444412', 12, 'main', null, true),
  ('44444444-4444-4444-4444-444444444413', 13, 'focus', 'brain-circuit', true),
  ('44444444-4444-4444-4444-444444444414', 14, 'focus', 'sparkles', true),
  ('44444444-4444-4444-4444-444444444415', 15, 'focus', 'shield-check', true),
  ('44444444-4444-4444-4444-444444444416', 16, 'focus', 'building-2', true)
on conflict (id) do nothing;

insert into public.topic_translations (topic_id, locale, title, description) values
  ('44444444-4444-4444-4444-444444444401', 'en', 'Artificial Intelligence and Machine Learning', ''),
  ('44444444-4444-4444-4444-444444444402', 'en', 'Natural Language Processing and Large Language Models', ''),
  ('44444444-4444-4444-4444-444444444403', 'en', 'Generative AI and Agentic Systems', ''),
  ('44444444-4444-4444-4444-444444444404', 'en', 'Data Science and Knowledge Discovery', ''),
  ('44444444-4444-4444-4444-444444444405', 'en', 'Computer Vision and Pattern Recognition', ''),
  ('44444444-4444-4444-4444-444444444406', 'en', 'Responsible, Explainable and Trustworthy AI', ''),
  ('44444444-4444-4444-4444-444444444407', 'en', 'Intelligent Information Systems', ''),
  ('44444444-4444-4444-4444-444444444408', 'en', 'Digital Transformation and Smart Applications', ''),
  ('44444444-4444-4444-4444-444444444409', 'en', 'IoT, Edge Intelligence and Smart Environments', ''),
  ('44444444-4444-4444-4444-444444444410', 'en', 'Cybersecurity and AI for Security', ''),
  ('44444444-4444-4444-4444-444444444411', 'en', 'AI for Education, Health, Industry and Society', ''),
  ('44444444-4444-4444-4444-444444444412', 'en', 'Emerging Computing and Interdisciplinary Applications', ''),
  ('44444444-4444-4444-4444-444444444413', 'en', 'Core NLP Tasks', 'Classification, Named Entity Recognition, Parsing, Summarization, Machine Translation'),
  ('44444444-4444-4444-4444-444444444414', 'en', 'Advanced Models', 'LLMs, Transformers, Prompting, Instruction Tuning, Semantic Search'),
  ('44444444-4444-4444-4444-444444444415', 'en', 'Trustworthy AI', 'Evaluation, Robustness, Bias Detection, Fairness, Explainability'),
  ('44444444-4444-4444-4444-444444444416', 'en', 'Real-World Apps', 'Education, Healthcare, Legal Tech, Finance, Industry Applications'),
  ('44444444-4444-4444-4444-444444444401', 'fr', 'Intelligence artificielle et apprentissage automatique', ''),
  ('44444444-4444-4444-4444-444444444402', 'fr', 'Traitement du langage naturel et grands modèles de langage', ''),
  ('44444444-4444-4444-4444-444444444403', 'fr', 'IA générative et systèmes agentiques', ''),
  ('44444444-4444-4444-4444-444444444404', 'fr', 'Science des données et découverte de connaissances', ''),
  ('44444444-4444-4444-4444-444444444405', 'fr', 'Vision par ordinateur et reconnaissance de motifs', ''),
  ('44444444-4444-4444-4444-444444444406', 'fr', 'IA responsable, explicable et digne de confiance', ''),
  ('44444444-4444-4444-4444-444444444407', 'fr', 'Systèmes d''information intelligents', ''),
  ('44444444-4444-4444-4444-444444444408', 'fr', 'Transformation numérique et applications intelligentes', ''),
  ('44444444-4444-4444-4444-444444444409', 'fr', 'IoT, intelligence en périphérie et environnements intelligents', ''),
  ('44444444-4444-4444-4444-444444444410', 'fr', 'Cybersécurité et IA pour la sécurité', ''),
  ('44444444-4444-4444-4444-444444444411', 'fr', 'IA pour l''éducation, la santé, l''industrie et la société', ''),
  ('44444444-4444-4444-4444-444444444412', 'fr', 'Informatique émergente et applications interdisciplinaires', ''),
  ('44444444-4444-4444-4444-444444444413', 'fr', 'Tâches TALN fondamentales', 'Classification, reconnaissance d''entités, parsing, résumé, traduction automatique'),
  ('44444444-4444-4444-4444-444444444414', 'fr', 'Modèles avancés', 'LLM, Transformers, prompting, instruction tuning, recherche sémantique'),
  ('44444444-4444-4444-4444-444444444415', 'fr', 'IA fiable', 'Évaluation, robustesse, détection des biais, équité, explicabilité'),
  ('44444444-4444-4444-4444-444444444416', 'fr', 'Applications réelles', 'Éducation, santé, legal tech, finance, applications industrielles'),
  ('44444444-4444-4444-4444-444444444401', 'ar', 'الذكاء الاصطناعي وتعلم الآلة', ''),
  ('44444444-4444-4444-4444-444444444402', 'ar', 'معالجة اللغة الطبيعية ونماذج اللغة الكبيرة', ''),
  ('44444444-4444-4444-4444-444444444403', 'ar', 'الذكاء الاصطناعي التوليدي والأنظمة الوكيلة', ''),
  ('44444444-4444-4444-4444-444444444404', 'ar', 'علم البيانات واكتشاف المعرفة', ''),
  ('44444444-4444-4444-4444-444444444405', 'ar', 'رؤية الحاسوب والتعرّف على الأنماط', ''),
  ('44444444-4444-4444-4444-444444444406', 'ar', 'ذكاء اصطناعي مسؤول وقابل للتفسير وموثوق', ''),
  ('44444444-4444-4444-4444-444444444407', 'ar', 'أنظمة المعلومات الذكية', ''),
  ('44444444-4444-4444-4444-444444444408', 'ar', 'التحول الرقمي والتطبيقات الذكية', ''),
  ('44444444-4444-4444-4444-444444444409', 'ar', 'إنترنت الأشياء والذكاء الطرفي والبيئات الذكية', ''),
  ('44444444-4444-4444-4444-444444444410', 'ar', 'الأمن السيبراني والذكاء الاصطناعي للأمن', ''),
  ('44444444-4444-4444-4444-444444444411', 'ar', 'الذكاء الاصطناعي للتعليم والصحة والصناعة والمجتمع', ''),
  ('44444444-4444-4444-4444-444444444412', 'ar', 'الحوسبة الناشئة والتطبيقات متعددة التخصصات', ''),
  ('44444444-4444-4444-4444-444444444413', 'ar', 'مهام أساسية في معالجة اللغة', 'التصنيف، التعرف على الكيانات، التحليل، الملخص، الترجمة الآلية'),
  ('44444444-4444-4444-4444-444444444414', 'ar', 'نماذج متقدمة', 'النماذج اللغوية الكبيرة، المحولات، التوجيه، ضبط التعليمات، البحث الدلالي'),
  ('44444444-4444-4444-4444-444444444415', 'ar', 'ذكاء اصطناعي موثوق', 'التقييم، المتانة، كشف التحيز، الإنصاف، القابلية للتفسير'),
  ('44444444-4444-4444-4444-444444444416', 'ar', 'تطبيقات واقعية', 'التعليم، الصحة، التقنية القانونية، المالية، التطبيقات الصناعية')
on conflict (topic_id, locale) do nothing;
