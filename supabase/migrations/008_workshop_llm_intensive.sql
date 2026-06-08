-- Workshop 3: Practical LLM Intensive with Hugging Face
-- Safe to re-run

do $$
declare
  w3_id uuid;
  loc public.locale;
begin
  if exists (
    select 1
    from public.workshop_translations wt
    where wt.title ilike '%Practical LLM Intensive%'
  ) then
    return;
  end if;

  insert into public.workshops (sort_order, icon, image_path, registration_url, duration, fee, is_published)
  values (
    2,
    'workflow',
    null,
    'https://ianlp.am2i.ma/en/ianlp/register',
    '2h00',
    '200 DH',
    true
  )
  returning id into w3_id;

  foreach loc in array array['en'::public.locale, 'fr'::public.locale, 'ar'::public.locale]
  loop
    if loc = 'fr' then
      insert into public.workshop_translations (
        workshop_id, locale, badge_label, title, subtitle, description,
        animator, animator_role, program, audience
      ) values (
        w3_id,
        loc,
        'Atelier 3',
        'Atelier intensif LLM : Fondements, Architectures et Fine-Tuning avec Hugging Face',
        'Atelier pratique — IANLP 2026',
        'Introduction pratique à l''écosystème des grands modèles de langage — comprendre, construire et adapter des systèmes d''IA générative avec Hugging Face.',
        'M. Zouheir Banou',
        'Chercheur et formateur technique en IA et ML',
        '["Fondements des LLM : tokenisation et embeddings","Architectures Transformer et mécanismes d''auto-attention","Modèles clés : GPT, LLaMA, DeepSeek, Qwen et Gemma","Stratégies d''échantillonnage pour la génération de texte","Fine-tuning efficient (PEFT/LoRA) avec Hugging Face"]'::jsonb,
        'Étudiants, chercheurs, développeurs, data scientists et passionnés d''IA. Connaissances de base en Python et en deep learning recommandées.'
      );
    elsif loc = 'ar' then
      insert into public.workshop_translations (
        workshop_id, locale, badge_label, title, subtitle, description,
        animator, animator_role, program, audience
      ) values (
        w3_id,
        loc,
        'الورشة 3',
        'ورشة LLM عملية: الأساسيات، البنيات والضبط الدقيق مع Hugging Face',
        'ورشة عمل تطبيقية — IANLP 2026',
        'مقدمة عملية لنظام النماذج اللغوية الكبيرة الحديث — فهم وبناء وتكييف أنظمة الذكاء الاصطناعي التوليدي باستخدام Hugging Face.',
        'Mr. Zouheir Banou',
        'باحث ومدرب تقني في الذكاء الاصطناعي وتعلم الآلة',
        '["أساسيات LLM: الترميز والتضمينات","بنى Transformer وآليات الانتباه الذاتي","نماذج رئيسية: GPT و LLaMA و DeepSeek و Qwen و Gemma","استراتيجيات أخذ العينات لتوليد النص","الضبط الدقيق بكفاءة (PEFT/LoRA) مع Hugging Face"]'::jsonb,
        'طلاب، باحثون، مطورون، علماء بيانات ومهتمون بالذكاء الاصطناعي. يُفضل معرفة أساسية بـ Python وتعلم عميق.'
      );
    else
      insert into public.workshop_translations (
        workshop_id, locale, badge_label, title, subtitle, description,
        animator, animator_role, program, audience
      ) values (
        w3_id,
        loc,
        'Workshop 3',
        'Practical LLM Intensive: Foundations, Architectures & Fine-Tuning with Hugging Face',
        'Hands-On Workshop — IANLP 2026',
        'A practical introduction to the modern Large Language Model ecosystem — understand, build, and adapt modern generative AI systems with Hugging Face.',
        'Mr. Zouheir Banou',
        'AI & ML Researcher and Technical Trainer',
        '["Core LLM foundations: tokenization and embeddings","Transformer architectures and self-attention mechanisms","Key models: GPT, LLaMA, DeepSeek, Qwen, and Gemma","Text generation sampling strategies","Parameter-Efficient Fine-Tuning (PEFT/LoRA) with Hugging Face"]'::jsonb,
        'Students, researchers, developers, data scientists, and AI enthusiasts. Basic Python and deep learning knowledge recommended.'
      );
    end if;
  end loop;
end $$;
