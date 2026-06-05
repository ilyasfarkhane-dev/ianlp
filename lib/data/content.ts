import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import type {
  ImportantDateWithTranslations,
  Locale,
  PartnerWithTranslations,
  PublicPartner,
  PublicSpeaker,
  SpeakerWithTranslations,
} from '@/types/database'

export type { PublicPartner, PublicSpeaker }

const STATIC_PARTNERS: Omit<PublicPartner, 'id'>[] = [
  { logoPath: '/PARTNERS/UNIV.jpeg', altText: 'Hassan II University', url: null },
  { logoPath: '/PARTNERS/FSBM.jpeg', altText: "Faculty of Sciences Ben M'Sick (FSBM)", url: null },
  { logoPath: '/PARTNERS/MI.jpeg', altText: 'MI', url: null },
  { logoPath: '/PARTNERS/LTIM.png', altText: 'LTIM', url: null },
  { logoPath: '/PARTNERS/AM2I.jpeg', altText: 'AM2I', url: null },
  { logoPath: '/PARTNERS/LIAS.jpeg', altText: 'LIAS', url: null },
  { logoPath: '/PARTNERS/LAMS.jpeg', altText: 'LAMS', url: null },
]

const STATIC_SPEAKER_IMAGES: Record<number, string> = {
  1: '/speakers/Jaouad DABOUNOU.jpeg',
  2: '/speakers/Atanasova.jpeg',
  3: '/speakers/Tanane.jpeg',
  4: '/speakers/Mihalcea.jpeg',
  5: '/speakers/Achtaich.jpeg',
}

export function mapSpeakerToPublic(
  speaker: SpeakerWithTranslations,
  locale: Locale
): PublicSpeaker | null {
  const translation =
    speaker.speaker_translations.find((t) => t.locale === locale) ??
    speaker.speaker_translations.find((t) => t.locale === 'en') ??
    speaker.speaker_translations[0]

  if (!translation) return null

  return {
    id: speaker.id,
    name: translation.name,
    affiliation: translation.affiliation,
    bio: translation.bio,
    imagePath: speaker.image_path,
    category: speaker.category,
  }
}

async function getStaticSpeakers(locale: Locale): Promise<PublicSpeaker[]> {
  const t = await getTranslations({ locale, namespace: 'keynote' })
  const ids = [1, 2, 3, 4, 5] as const

  return ids.map((id) => ({
    id: String(id),
    name: t(`speaker${id}Name`),
    affiliation: t(`speaker${id}Affiliation`),
    bio: t(`speaker${id}Bio`),
    imagePath: STATIC_SPEAKER_IMAGES[id] ?? null,
    category: 'keynote' as const,
  }))
}

export async function getSpeakersForLocale(locale: Locale): Promise<PublicSpeaker[]> {
  if (!isSupabaseConfigured()) {
    return getStaticSpeakers(locale)
  }

  const { data, error } = await getPublishedSpeakers()

  if (error || data.length === 0) {
    return getStaticSpeakers(locale)
  }

  return data
    .map((speaker) => mapSpeakerToPublic(speaker, locale))
    .filter((speaker): speaker is PublicSpeaker => speaker !== null)
}

export function mapPartnerToPublic(
  partner: PartnerWithTranslations,
  locale: Locale
): PublicPartner | null {
  const translation =
    partner.partner_translations.find((t) => t.locale === locale) ??
    partner.partner_translations.find((t) => t.locale === 'en') ??
    partner.partner_translations[0]

  if (!translation) return null

  return {
    id: partner.id,
    logoPath: partner.logo_path,
    altText: translation.alt_text,
    url: partner.url,
  }
}

function getStaticPartners(): PublicPartner[] {
  return STATIC_PARTNERS.map((partner, index) => ({
    id: String(index + 1),
    ...partner,
  }))
}

export async function getPartnersForLocale(locale: Locale): Promise<PublicPartner[]> {
  if (!isSupabaseConfigured()) {
    return getStaticPartners()
  }

  const { data, error } = await getPublishedPartners()

  if (error || data.length === 0) {
    return getStaticPartners()
  }

  return data
    .map((partner) => mapPartnerToPublic(partner, locale))
    .filter((partner): partner is PublicPartner => partner !== null)
}

export async function getPublishedSpeakers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('speakers')
    .select('*, speaker_translations(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) return { data: [] as SpeakerWithTranslations[], error }
  return { data: (data ?? []) as SpeakerWithTranslations[], error: null }
}

export async function getPublishedDates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('important_dates')
    .select('*, important_date_translations(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) return { data: [] as ImportantDateWithTranslations[], error }
  return { data: (data ?? []) as ImportantDateWithTranslations[], error: null }
}

export async function getPublishedPartners() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*, partner_translations(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) return { data: [] as PartnerWithTranslations[], error }
  return { data: (data ?? []) as PartnerWithTranslations[], error: null }
}

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')

  if (error) return { data: {}, error }

  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]))
  return { data: settings, error: null }
}
