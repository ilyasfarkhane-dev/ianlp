import { LOCALES, type Locale } from '@/types/database'

export function buildTranslationsForAllLocales<T extends Record<string, string>>(
  values: T
): Array<{ locale: Locale } & T> {
  return LOCALES.map((locale) => ({ locale, ...values }))
}

export function getPreferredTranslation<T extends { locale: Locale }>(
  translations: T[] | undefined,
  pick: (item: T) => string,
  fallback = ''
): string {
  if (!translations?.length) return fallback

  const preferred =
    translations.find((item) => item.locale === 'en') ??
    translations.find((item) => pick(item).trim().length > 0) ??
    translations[0]

  return preferred ? pick(preferred) : fallback
}
