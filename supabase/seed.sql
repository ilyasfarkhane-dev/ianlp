-- Seed current IANLP content into Supabase
-- Run AFTER schema.sql and after creating an admin user

-- Speakers (from messages/en.json + public/speakers/)
insert into public.speakers (id, sort_order, image_path, category, is_published) values
  ('11111111-1111-1111-1111-111111111101', 1, '/speakers/Jaouad DABOUNOU.jpeg', 'keynote', true),
  ('11111111-1111-1111-1111-111111111102', 2, '/speakers/Atanasova.jpeg', 'keynote', true),
  ('11111111-1111-1111-1111-111111111103', 3, '/speakers/Tanane.jpeg', 'keynote', true),
  ('11111111-1111-1111-1111-111111111104', 4, '/speakers/Mihalcea.jpeg', 'keynote', true),
  ('11111111-1111-1111-1111-111111111105', 5, '/speakers/Achtaich.jpeg', 'keynote', true)
on conflict (id) do nothing;

insert into public.speaker_translations (speaker_id, locale, name, affiliation, bio) values
  ('11111111-1111-1111-1111-111111111101', 'en', 'Pr. Jaouad DABOUNOU', 'Hassan I University , Morocco', 'Jaouad DABOUNOU is Professor at Hassan 1st University (FST of Settat) since 1994.'),
  ('11111111-1111-1111-1111-111111111102', 'en', 'Dr. Pepa Atanasova', 'University of Copenhagen, Denmark', 'Pepa Atanasova is Assistant Professor (Tenure Track) in the Department of Computer Science, NLP Section at the University of Copenhagen.'),
  ('11111111-1111-1111-1111-111111111103', 'en', 'Pr. Omar TANANE', 'Hassan II University of Casablanca, FSBM', 'Professor at the Faculty of Sciences Ben M''Sik, Hassan II University of Casablanca.'),
  ('11111111-1111-1111-1111-111111111104', 'en', 'Prof. Rada Mihalcea', 'University of Michigan, Computer Science & Engineering', 'Janice M. Jenkins Collegiate Professor of Computer Science and Engineering at the University of Michigan.'),
  ('11111111-1111-1111-1111-111111111105', 'en', 'Pr. Khadija Achtaich', 'LTIM, Hassan II University of Casablanca, FSBM', 'Professor at the Laboratory of Information Technology and Modeling (LTIM), Faculty of Sciences Ben M''Sik.')
on conflict (speaker_id, locale) do nothing;

-- Important dates
insert into public.important_dates (id, sort_order, tab, date_value, is_published) values
  ('22222222-2222-2222-2222-222222222201', 1, 'submission', 'June 13, 2026', true),
  ('22222222-2222-2222-2222-222222222202', 2, 'review', 'June 20, 2026', true),
  ('22222222-2222-2222-2222-222222222203', 3, 'review', 'June 25, 2026', true),
  ('22222222-2222-2222-2222-222222222204', 4, 'conference', 'June 29-30, 2026', true)
on conflict (id) do nothing;

insert into public.important_date_translations (date_id, locale, label, description) values
  ('22222222-2222-2222-2222-222222222201', 'en', 'Paper Submission Deadline', 'Submit your original research papers'),
  ('22222222-2222-2222-2222-222222222202', 'en', 'Notification of Acceptance', 'Receive review results and decisions'),
  ('22222222-2222-2222-2222-222222222203', 'en', 'Camera-Ready Deadline', 'Submit final papers incorporating reviews'),
  ('22222222-2222-2222-2222-222222222204', 'en', 'Conference Dates', 'IANLP 2026 takes place in Casablanca')
on conflict (date_id, locale) do nothing;

-- Partners
insert into public.partners (id, sort_order, logo_path, is_published) values
  ('33333333-3333-3333-3333-333333333301', 1, '/PARTNERS/UNIV.jpeg', true),
  ('33333333-3333-3333-3333-333333333302', 2, '/PARTNERS/FSBM.jpeg', true),
  ('33333333-3333-3333-3333-333333333303', 3, '/PARTNERS/MI.jpeg', true),
  ('33333333-3333-3333-3333-333333333304', 4, '/PARTNERS/LTIM.png', true),
  ('33333333-3333-3333-3333-333333333305', 5, '/PARTNERS/AM2I.jpeg', true),
  ('33333333-3333-3333-3333-333333333306', 6, '/PARTNERS/LIAS.jpeg', true),
  ('33333333-3333-3333-3333-333333333307', 7, '/PARTNERS/LAMS.jpeg', true)
on conflict (id) do nothing;

insert into public.partner_translations (partner_id, locale, alt_text) values
  ('33333333-3333-3333-3333-333333333301', 'en', 'Hassan II University'),
  ('33333333-3333-3333-3333-333333333302', 'en', 'Faculty of Sciences Ben M''Sick (FSBM)'),
  ('33333333-3333-3333-3333-333333333303', 'en', 'MI'),
  ('33333333-3333-3333-3333-333333333304', 'en', 'LTIM'),
  ('33333333-3333-3333-3333-333333333305', 'en', 'AM2I'),
  ('33333333-3333-3333-3333-333333333306', 'en', 'LIAS'),
  ('33333333-3333-3333-3333-333333333307', 'en', 'LAMS')
on conflict (partner_id, locale) do nothing;

-- Topics (main thematic areas + special focus)
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
  ('44444444-4444-4444-4444-444444444416', 'en', 'Real-World Apps', 'Education, Healthcare, Legal Tech, Finance, Industry Applications')
on conflict (topic_id, locale) do nothing;
