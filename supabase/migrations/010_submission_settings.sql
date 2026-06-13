-- Submission guidelines content (site_settings.submission)
-- Safe to re-run

insert into public.site_settings (key, value)
values (
  'submission',
  '{
    "en": {
      "label": "Submission",
      "title": "Submission Guidelines",
      "subtitle": "Everything you need to know about submitting your research to IANLP 2026",
      "platform": "Submission Platform",
      "platformDesc": "EasyChair",
      "platformUrl": "https://easychair.org/conferences/?conf=ianlp2026",
      "platformItems": ["Easy manuscript upload", "Real-time status tracking"],
      "format": "Paper Format",
      "formatDesc": "Official SPRINGER Template",
      "formatUrl": "https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines",
      "formatItems": ["Available in Word & LaTeX", "Full papers: 12-15+ pages; Short: 6-11 pages", "Includes references"],
      "keyReqs": "Key Requirements",
      "keyReqsDesc": "Submission Policy",
      "keyReqsItems": ["Original & unpublished work", "Double-blind (anonymized)", "3+ independent reviews"],
      "qualityEthics": "Quality & Ethics Standards",
      "evaluationCriteria": "Evaluation Criteria",
      "evaluationItems": ["Novelty & originality of contributions", "Technical soundness & methodology", "Significance & impact on field", "Clarity & presentation quality", "Relevance to IANLP scope"],
      "plagiarism": "Plagiarism & Integrity",
      "plagiarismItems": ["Mandatory plagiarism screening", "iThenticate preferred tool", "Original work only required", "Double-blind review process", "Conflict-of-interest management"]
    },
    "fr": {
      "label": "Soumission",
      "title": "Instructions de soumission",
      "subtitle": "Tout ce qu''il faut savoir pour soumettre votre recherche à IANLP 2026",
      "platform": "Plateforme de soumission",
      "platformDesc": "EasyChair",
      "platformUrl": "https://easychair.org/conferences/?conf=ianlp2026",
      "platformItems": ["Téléversement simple", "Suivi en temps réel"],
      "format": "Format des articles",
      "formatDesc": "Modèle SPRINGER officiel",
      "formatUrl": "https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines",
      "formatItems": ["Word et LaTeX", "Articles complets : 12-15+ pages ; courts : 6-11 pages", "Références incluses"],
      "keyReqs": "Exigences clés",
      "keyReqsDesc": "Politique de soumission",
      "keyReqsItems": ["Travail original et inédit", "Double aveugle (anonymisé)", "3+ relectures indépendantes"],
      "qualityEthics": "Qualité et éthique",
      "evaluationCriteria": "Critères d''évaluation",
      "evaluationItems": ["Novelty et originalité", "Solidité technique et méthodologie", "Portée et impact", "Clarté et qualité de présentation", "Pertinence pour IANLP"],
      "plagiarism": "Plagiat et intégrité",
      "plagiarismItems": ["Contrôle anti-plagiat obligatoire", "Outil privilégié iThenticate", "Travail original uniquement", "Processus en double aveugle", "Gestion des conflits d''intérêt"]
    },
    "ar": {
      "label": "التقديم",
      "title": "إرشادات التقديم",
      "subtitle": "كل ما تحتاج معرفته لتقديم بحثك إلى IANLP 2026",
      "platform": "منصة التقديم",
      "platformDesc": "EasyChair",
      "platformUrl": "https://easychair.org/conferences/?conf=ianlp2026",
      "platformItems": ["رفع ميسر للمخطوطات", "متابعة الحالة في الوقت الفعلي"],
      "format": "صيغة الورقة",
      "formatDesc": "القالب الرسمي SPRINGER",
      "formatUrl": "https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines",
      "formatItems": ["متوفر Word و LaTeX", "أوراق كاملة: 12-15+ صفحة؛ قصيرة: 6-11 صفحة", "تشمل المراجع"],
      "keyReqs": "المتطلبات الرئيسية",
      "keyReqsDesc": "سياسة التقديم",
      "keyReqsItems": ["عمل أصلي وغير منشور", "تعمية مزدوجة (مجهول)", "3+ تحكيمات مستقلة"],
      "qualityEthics": "الجودة والمعايير الأخلاقية",
      "evaluationCriteria": "معايير التقييم",
      "evaluationItems": ["الجدة والأصالة", "المتانة المنهجية والتقنية", "الأهمية والتأثير", "الوضوح وجودة العرض", "الملاءمة لمجال IANLP"],
      "plagiarism": "الانتحال والنزاهة",
      "plagiarismItems": ["فحص انتحال إلزامي", "الأداة المفضلة iThenticate", "أعمال أصلية فقط", "عملية تحكيم مزدوج التعمية", "إدارة تضارب المصالح"]
    }
  }'::jsonb
)
on conflict (key) do nothing;
