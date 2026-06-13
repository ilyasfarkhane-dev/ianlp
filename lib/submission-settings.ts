import { LOCALES, type Locale } from '@/types/database'

export type SubmissionLocaleContent = {
  label: string
  title: string
  subtitle: string
  platform: string
  platformDesc: string
  platformUrl: string
  platformItems: string[]
  format: string
  formatDesc: string
  formatUrl: string
  formatItems: string[]
  keyReqs: string
  keyReqsDesc: string
  keyReqsItems: string[]
  qualityEthics: string
  evaluationCriteria: string
  evaluationItems: string[]
  plagiarism: string
  plagiarismItems: string[]
}

export type SubmissionSettingsValue = Record<Locale, SubmissionLocaleContent>

export type PublicSubmissionContent = SubmissionLocaleContent

export const DEFAULT_SUBMISSION_PLATFORM_URL =
  'https://easychair.org/conferences/?conf=ianlp2026'

export const DEFAULT_SUBMISSION_FORMAT_URL =
  'https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines'

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback
  const items = value.filter((item): item is string => typeof item === 'string' && item.trim())
  return items.length > 0 ? items : fallback
}

function normalizeLocaleContent(
  raw: Record<string, unknown> | undefined,
  fallback: SubmissionLocaleContent
): SubmissionLocaleContent {
  if (!raw) return fallback

  return {
    label: getString(raw.label, fallback.label),
    title: getString(raw.title, fallback.title),
    subtitle: getString(raw.subtitle, fallback.subtitle),
    platform: getString(raw.platform, fallback.platform),
    platformDesc: getString(raw.platformDesc, fallback.platformDesc),
    platformUrl: getString(raw.platformUrl, fallback.platformUrl),
    platformItems: normalizeStringList(raw.platformItems, fallback.platformItems),
    format: getString(raw.format, fallback.format),
    formatDesc: getString(raw.formatDesc, fallback.formatDesc),
    formatUrl: getString(raw.formatUrl, fallback.formatUrl),
    formatItems: normalizeStringList(raw.formatItems, fallback.formatItems),
    keyReqs: getString(raw.keyReqs, fallback.keyReqs),
    keyReqsDesc: getString(raw.keyReqsDesc, fallback.keyReqsDesc),
    keyReqsItems: normalizeStringList(raw.keyReqsItems, fallback.keyReqsItems),
    qualityEthics: getString(raw.qualityEthics, fallback.qualityEthics),
    evaluationCriteria: getString(raw.evaluationCriteria, fallback.evaluationCriteria),
    evaluationItems: normalizeStringList(raw.evaluationItems, fallback.evaluationItems),
    plagiarism: getString(raw.plagiarism, fallback.plagiarism),
    plagiarismItems: normalizeStringList(raw.plagiarismItems, fallback.plagiarismItems),
  }
}

export function createEmptySubmissionLocaleContent(): SubmissionLocaleContent {
  return {
    label: '',
    title: '',
    subtitle: '',
    platform: '',
    platformDesc: '',
    platformUrl: '',
    platformItems: [''],
    format: '',
    formatDesc: '',
    formatUrl: '',
    formatItems: [''],
    keyReqs: '',
    keyReqsDesc: '',
    keyReqsItems: [''],
    qualityEthics: '',
    evaluationCriteria: '',
    evaluationItems: [''],
    plagiarism: '',
    plagiarismItems: [''],
  }
}

export function normalizeSubmissionSettings(
  raw: Record<string, unknown> | undefined,
  fallbacks: SubmissionSettingsValue
): SubmissionSettingsValue {
  const result = {} as SubmissionSettingsValue

  for (const locale of LOCALES) {
    const localeRaw = raw?.[locale]
    const localeFallback = fallbacks[locale]
    result[locale] = normalizeLocaleContent(
      localeRaw && typeof localeRaw === 'object'
        ? (localeRaw as Record<string, unknown>)
        : undefined,
      localeFallback
    )
  }

  return result
}

export function serializeSubmissionSettings(value: SubmissionSettingsValue): SubmissionSettingsValue {
  const trimList = (items: string[]) => items.map((item) => item.trim()).filter(Boolean)

  const serializeLocale = (content: SubmissionLocaleContent): SubmissionLocaleContent => ({
    label: content.label.trim(),
    title: content.title.trim(),
    subtitle: content.subtitle.trim(),
    platform: content.platform.trim(),
    platformDesc: content.platformDesc.trim(),
    platformUrl: content.platformUrl.trim(),
    platformItems: trimList(content.platformItems),
    format: content.format.trim(),
    formatDesc: content.formatDesc.trim(),
    formatUrl: content.formatUrl.trim(),
    formatItems: trimList(content.formatItems),
    keyReqs: content.keyReqs.trim(),
    keyReqsDesc: content.keyReqsDesc.trim(),
    keyReqsItems: trimList(content.keyReqsItems),
    qualityEthics: content.qualityEthics.trim(),
    evaluationCriteria: content.evaluationCriteria.trim(),
    evaluationItems: trimList(content.evaluationItems),
    plagiarism: content.plagiarism.trim(),
    plagiarismItems: trimList(content.plagiarismItems),
  })

  return {
    en: serializeLocale(value.en),
    fr: serializeLocale(value.fr),
    ar: serializeLocale(value.ar),
  }
}

export function getSubmissionContentForLocale(
  settings: SubmissionSettingsValue,
  locale: Locale
): PublicSubmissionContent {
  return settings[locale] ?? settings.en
}

export function mergeSubmissionLinks(
  content: SubmissionLocaleContent,
  links?: { easychair?: unknown; springerTemplate?: unknown }
): SubmissionLocaleContent {
  const easychair =
    typeof links?.easychair === 'string' && links.easychair.trim()
      ? links.easychair.trim()
      : DEFAULT_SUBMISSION_PLATFORM_URL
  const springerTemplate =
    typeof links?.springerTemplate === 'string' && links.springerTemplate.trim()
      ? links.springerTemplate.trim()
      : DEFAULT_SUBMISSION_FORMAT_URL

  return {
    ...content,
    platformUrl: content.platformUrl.trim() || easychair,
    formatUrl: content.formatUrl.trim() || springerTemplate,
  }
}

export function expandSubmissionToAllLocales(
  content: SubmissionLocaleContent,
  existing?: SubmissionSettingsValue
): SubmissionSettingsValue {
  if (existing) {
    return serializeSubmissionSettings({
      en: content,
      fr: existing.fr,
      ar: existing.ar,
    })
  }

  return serializeSubmissionSettings({
    en: content,
    fr: content,
    ar: content,
  })
}
