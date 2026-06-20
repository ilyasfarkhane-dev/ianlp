import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { normalizeContactSettings } from '@/lib/contact-settings'
import {
  getSubmissionContentForLocale,
  mergeSubmissionLinks,
  normalizeSubmissionSettings,
  DEFAULT_SUBMISSION_FORMAT_URL,
  DEFAULT_SUBMISSION_PLATFORM_URL,
  type PublicSubmissionContent,
  type SubmissionSettingsValue,
} from '@/lib/submission-settings'
import type {
  CommitteeIcon,
  CommitteeMemberWithTranslations,
  FocusIcon,
  ImportantDateWithTranslations,
  Json,
  Locale,
  PartnerWithTranslations,
  PricingTierWithTranslations,
  PublicCommitteeMember,
  PublicCommitteesContent,
  PublicContactInfo,
  PublicImportantDate,
  PublicPartner,
  PublicPricingTier,
  PublicRegisterPageContent,
  PublicSpeaker,
  PublicTopic,
  PublicTopicsContent,
  PublicWorkshop,
  SpeakerWithTranslations,
  TopicWithTranslations,
  WorkshopIcon,
  WorkshopWithTranslations,
} from '@/types/database'

export type {
  PublicCommitteeMember,
  PublicCommitteesContent,
  PublicContactInfo,
  PublicImportantDate,
  PublicPartner,
  PublicPricingTier,
  PublicRegisterPageContent,
  PublicSpeaker,
  PublicTopic,
  PublicTopicsContent,
  PublicWorkshop,
}

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

export function mapDateToPublic(
  date: ImportantDateWithTranslations,
  locale: Locale
): PublicImportantDate | null {
  const translation =
    date.important_date_translations.find((t) => t.locale === locale) ??
    date.important_date_translations.find((t) => t.locale === 'en') ??
    date.important_date_translations[0]

  if (!translation) return null

  return {
    id: date.id,
    tab: date.tab,
    dateValue: date.date_value,
    label: translation.label,
    description: translation.description,
  }
}

async function getStaticDates(locale: Locale): Promise<PublicImportantDate[]> {
  const t = await getTranslations({ locale, namespace: 'dates' })

  return [
    {
      id: 'static-1',
      tab: 'submission',
      dateValue: t('paperDate'),
      label: t('paperDeadline'),
      description: t('paperDesc'),
    },
    {
      id: 'static-2',
      tab: 'review',
      dateValue: t('notificationDate'),
      label: t('notification'),
      description: t('notificationDesc'),
    },
    {
      id: 'static-3',
      tab: 'review',
      dateValue: t('cameraReadyDate'),
      label: t('cameraReady'),
      description: t('cameraReadyDesc'),
    },
    {
      id: 'static-4',
      tab: 'conference',
      dateValue: t('conferenceDate'),
      label: t('conferenceDates'),
      description: t('conferenceDesc'),
    },
  ]
}

export async function getDatesForLocale(locale: Locale): Promise<PublicImportantDate[]> {
  if (!isSupabaseConfigured()) {
    return getStaticDates(locale)
  }

  const { data, error } = await getPublishedDates()

  if (error || data.length === 0) {
    return getStaticDates(locale)
  }

  return data
    .map((date) => mapDateToPublic(date, locale))
    .filter((date): date is PublicImportantDate => date !== null)
}

function parseFocusIcon(icon: string | null): FocusIcon | null {
  if (
    icon === 'brain-circuit' ||
    icon === 'sparkles' ||
    icon === 'shield-check' ||
    icon === 'building-2'
  ) {
    return icon
  }

  return null
}

export function mapTopicToPublic(topic: TopicWithTranslations, locale: Locale): PublicTopic | null {
  const translation =
    topic.topic_translations.find((t) => t.locale === locale) ??
    topic.topic_translations.find((t) => t.locale === 'en') ??
    topic.topic_translations[0]

  if (!translation) return null

  return {
    id: topic.id,
    title: translation.title,
    description: translation.description,
    icon: topic.topic_type === 'focus' ? parseFocusIcon(topic.icon) ?? 'sparkles' : null,
  }
}

async function getStaticTopics(locale: Locale): Promise<PublicTopicsContent> {
  const t = await getTranslations({ locale, namespace: 'topics' })
  const mainKeys = [
    'topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6',
    'topic7', 'topic8', 'topic9', 'topic10', 'topic11', 'topic12',
  ] as const

  const focusItems = [
    { titleKey: 'coreNlp', descKey: 'coreNlpDesc', icon: 'brain-circuit' as FocusIcon },
    { titleKey: 'advancedModels', descKey: 'advancedModelsDesc', icon: 'sparkles' as FocusIcon },
    { titleKey: 'trustworthyAi', descKey: 'trustworthyAiDesc', icon: 'shield-check' as FocusIcon },
    { titleKey: 'realWorldApps', descKey: 'realWorldAppsDesc', icon: 'building-2' as FocusIcon },
  ] as const

  return {
    mainTopics: mainKeys.map((key, index) => ({
      id: `static-main-${index + 1}`,
      title: t(key),
      description: '',
      icon: null,
    })),
    focusAreas: focusItems.map((item, index) => ({
      id: `static-focus-${index + 1}`,
      title: t(item.titleKey),
      description: t(item.descKey),
      icon: item.icon,
    })),
  }
}

export async function getTopicsForLocale(locale: Locale): Promise<PublicTopicsContent> {
  if (!isSupabaseConfigured()) {
    return getStaticTopics(locale)
  }

  const { data, error } = await getPublishedTopics()

  if (error || data.length === 0) {
    return getStaticTopics(locale)
  }

  const mainTopics: PublicTopic[] = []
  const focusAreas: PublicTopic[] = []

  for (const topic of data) {
    const mapped = mapTopicToPublic(topic, locale)
    if (!mapped) continue

    if (topic.topic_type === 'main') {
      mainTopics.push(mapped)
    } else {
      focusAreas.push(mapped)
    }
  }

  if (mainTopics.length === 0 && focusAreas.length === 0) {
    return getStaticTopics(locale)
  }

  return { mainTopics, focusAreas }
}

function parseCommitteeIcon(icon: string | null): CommitteeIcon | null {
  if (icon === 'user-round' || icon === 'building-2') {
    return icon
  }

  return null
}

export function mapCommitteeMemberToPublic(
  member: CommitteeMemberWithTranslations,
  locale: Locale
): PublicCommitteeMember | null {
  const translation =
    member.committee_member_translations.find((t) => t.locale === locale) ??
    member.committee_member_translations.find((t) => t.locale === 'en') ??
    member.committee_member_translations[0]

  if (!translation) return null

  return {
    id: member.id,
    name: translation.name,
    affiliation: translation.affiliation,
    roleLabel: translation.role_label,
    email: member.email,
    icon:
      member.committee_type === 'institution'
        ? parseCommitteeIcon(member.icon) ?? 'user-round'
        : null,
  }
}

async function getStaticCommittees(locale: Locale): Promise<PublicCommitteesContent> {
  const t = await getTranslations({ locale, namespace: 'committees' })

  const pcChairs = Array.from({ length: 6 }, (_, index) => {
    const i = index + 1
    return {
      id: `static-pc-${i}`,
      name: t(`pcChair${i}`),
      affiliation: t(`pcChair${i}Aff`),
      roleLabel: '',
      email: null,
      icon: null,
    }
  })

  const reviewers = Array.from({ length: 12 }, (_, index) => {
    const i = index + 1
    return {
      id: `static-reviewer-${i}`,
      name: t(`reviewer${i}Name`),
      affiliation: t(`reviewer${i}Aff`),
      roleLabel: '',
      email: null,
      icon: null,
    }
  })

  const institution: PublicCommitteeMember[] = [
    {
      id: 'static-inst-1',
      name: t('profOmar'),
      affiliation: t('fsbmH2c'),
      roleLabel: t('generalChair'),
      email: 'omar.zahour@univh2c.ma',
      icon: 'user-round',
    },
    {
      id: 'static-inst-2',
      name: t('am2iFsbm'),
      affiliation: t('h2cAddress'),
      roleLabel: t('organizingInstitution'),
      email: null,
      icon: 'building-2',
    },
  ]

  return { pcChairs, scientific: [], reviewers, institution, organizing: [] }
}

export async function getCommitteesForLocale(locale: Locale): Promise<PublicCommitteesContent> {
  if (!isSupabaseConfigured()) {
    return getStaticCommittees(locale)
  }

  const { data, error } = await getPublishedCommitteeMembers()

  if (error || data.length === 0) {
    return getStaticCommittees(locale)
  }

  const pcChairs: PublicCommitteeMember[] = []
  const scientific: PublicCommitteeMember[] = []
  const reviewers: PublicCommitteeMember[] = []
  const institution: PublicCommitteeMember[] = []
  const organizing: PublicCommitteeMember[] = []

  for (const member of data) {
    const mapped = mapCommitteeMemberToPublic(member, locale)
    if (!mapped) continue

    if (member.committee_type === 'pc_chair') {
      pcChairs.push(mapped)
    } else if (member.committee_type === 'scientific') {
      scientific.push(mapped)
    } else if (member.committee_type === 'reviewer') {
      reviewers.push(mapped)
    } else if (member.committee_type === 'institution') {
      institution.push(mapped)
    } else {
      organizing.push(mapped)
    }
  }

  if (
    pcChairs.length === 0 &&
    scientific.length === 0 &&
    reviewers.length === 0 &&
    institution.length === 0 &&
    organizing.length === 0
  ) {
    return getStaticCommittees(locale)
  }

  return { pcChairs, scientific, reviewers, institution, organizing }
}

function parseFeatures(value: Json | undefined): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export function mapPricingTierToPublic(
  tier: PricingTierWithTranslations,
  locale: Locale
): PublicPricingTier | null {
  const translation =
    tier.pricing_tier_translations.find((t) => t.locale === locale) ??
    tier.pricing_tier_translations.find((t) => t.locale === 'en') ??
    tier.pricing_tier_translations[0]

  if (!translation) return null

  return {
    id: tier.id,
    name: translation.name,
    price: tier.price,
    currency: tier.currency,
    features: parseFeatures(translation.features),
    isFeatured: tier.is_featured,
  }
}

async function getStaticPricing(locale: Locale): Promise<PublicPricingTier[]> {
  const t = await getTranslations({ locale, namespace: 'pricing' })

  return [
    {
      id: 'static-in-person',
      name: t('inPersonName'),
      price: '300',
      currency: 'MAD',
      isFeatured: true,
      features: Array.from({ length: 9 }, (_, i) => t(`inPersonFeature${i + 1}`)),
    },
    {
      id: 'static-distance',
      name: t('distanceName'),
      price: '150',
      currency: 'MAD',
      isFeatured: false,
      features: Array.from({ length: 3 }, (_, i) => t(`distanceFeature${i + 1}`)),
    },
  ]
}

export async function getPricingForLocale(locale: Locale): Promise<PublicPricingTier[]> {
  if (!isSupabaseConfigured()) {
    return getStaticPricing(locale)
  }

  const { data, error } = await getPublishedPricingTiers()

  if (error || data.length === 0) {
    return getStaticPricing(locale)
  }

  const mapped = data
    .map((tier) => mapPricingTierToPublic(tier, locale))
    .filter((tier): tier is PublicPricingTier => tier !== null)

  return mapped.length > 0 ? mapped : getStaticPricing(locale)
}

function getStringSetting(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

async function getStaticContact(locale: Locale): Promise<PublicContactInfo> {
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    emails: ['omar.zahour@univh2c.ma'],
    phone: '+212660082091',
    phoneDisplay: '+212 6 60 08 20 91',
    address: t('addressValue'),
    programChairs: [
      {
        name: 'Prof. Omar Zahour',
        affiliationPrimary: "Faculty of Sciences Ben M'Sick (FSBM)",
        affiliationSecondary: 'Hassan II University of Casablanca',
      },
    ],
  }
}

export async function getContactForLocale(locale: Locale): Promise<PublicContactInfo> {
  const fallback = await getStaticContact(locale)

  if (!isSupabaseConfigured()) {
    return fallback
  }

  const { data, error } = await getSiteSettings()

  if (error || !data.contact) {
    return fallback
  }

  return normalizeContactSettings(data.contact as Record<string, unknown>, fallback)
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

export async function getPublishedTopics() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*, topic_translations(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) return { data: [] as TopicWithTranslations[], error }
  return { data: (data ?? []) as TopicWithTranslations[], error: null }
}

export async function getPublishedCommitteeMembers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('committee_members')
    .select('*, committee_member_translations(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) return { data: [] as CommitteeMemberWithTranslations[], error }
  return { data: (data ?? []) as CommitteeMemberWithTranslations[], error: null }
}

export async function getPublishedPricingTiers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_tiers')
    .select('*, pricing_tier_translations(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) return { data: [] as PricingTierWithTranslations[], error }
  return { data: (data ?? []) as PricingTierWithTranslations[], error: null }
}

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')

  if (error) return { data: {}, error }

  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]))
  return { data: settings, error: null }
}

function parseWorkshopIcon(icon: string | null | undefined): WorkshopIcon {
  if (icon === 'workflow') return 'workflow'
  return 'video'
}

export function mapWorkshopToPublic(
  workshop: WorkshopWithTranslations,
  locale: Locale
): PublicWorkshop | null {
  const translation =
    workshop.workshop_translations.find((t) => t.locale === locale) ??
    workshop.workshop_translations.find((t) => t.locale === 'en') ??
    workshop.workshop_translations[0]

  if (!translation) return null

  return {
    id: workshop.id,
    icon: parseWorkshopIcon(workshop.icon),
    imagePath: workshop.image_path,
    registrationUrl: workshop.registration_url,
    duration: workshop.duration,
    fee: workshop.fee,
    badgeLabel: translation.badge_label,
    title: translation.title,
    subtitle: translation.subtitle,
    description: translation.description,
    animator: translation.animator,
    animatorRole: translation.animator_role,
    program: parseFeatures(translation.program),
    audience: translation.audience,
  }
}

async function getStaticWorkshops(locale: Locale): Promise<PublicWorkshop[]> {
  const t = await getTranslations({ locale, namespace: 'register' })

  const configs = [
    {
      id: 'textToVideo',
      icon: 'video' as const,
      imagePath: '/workshops/w1.jpg',
      registrationUrl:
        'https://docs.google.com/forms/d/e/1FAIpQLSexlxRa97uIEUGNECvlgGkC1Qw1E2K9jaYnGFK1XCA55ZJGmg/viewform',
      numberKey: 'workshopNumber1' as const,
    },
    {
      id: 'noCodeAutomation',
      icon: 'workflow' as const,
      imagePath: '/workshops/w2.jpg',
      registrationUrl:
        'https://docs.google.com/forms/d/e/1FAIpQLSfJX-6YG7hETweSRgodTLQcABLjGvT31bJmx_3WbT80DNGfMA/viewform',
      numberKey: 'workshopNumber2' as const,
    },
  ]

  return configs.map(({ id, icon, imagePath, registrationUrl, numberKey }) => ({
    id,
    icon,
    imagePath,
    registrationUrl,
    duration: t(`workshops.${id}.duration`),
    fee: t(`workshops.${id}.fee`),
    badgeLabel: t(numberKey),
    title: t(`workshops.${id}.title`),
    subtitle: t(`workshops.${id}.subtitle`),
    description: t(`workshops.${id}.description`),
    animator: t(`workshops.${id}.animator`),
    animatorRole: t(`workshops.${id}.animatorRole`),
    program: ['program1', 'program2', 'program3', 'program4'].map((key) =>
      t(`workshops.${id}.${key}`)
    ),
    audience: t(`workshops.${id}.audience`),
  }))
}

export async function getPublishedWorkshops() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workshops')
    .select('*, workshop_translations(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) return { data: [] as WorkshopWithTranslations[], error }
  return { data: (data ?? []) as WorkshopWithTranslations[], error: null }
}

export async function getWorkshopsForLocale(locale: Locale): Promise<PublicWorkshop[]> {
  if (!isSupabaseConfigured()) {
    return getStaticWorkshops(locale)
  }

  const { data, error } = await getPublishedWorkshops()

  if (error || data.length === 0) {
    return getStaticWorkshops(locale)
  }

  const mapped = data
    .map((workshop) => mapWorkshopToPublic(workshop, locale))
    .filter((workshop): workshop is PublicWorkshop => workshop !== null)

  return mapped.length > 0 ? mapped : getStaticWorkshops(locale)
}

async function getStaticRegisterPageContent(locale: Locale): Promise<PublicRegisterPageContent> {
  const t = await getTranslations({ locale, namespace: 'register' })

  return {
    pageTitle: t('title'),
    pageSubtitle: t('subtitle'),
    datesValue: t('datesValue'),
    conferenceStep: t('conferenceStep'),
    feesTitle: t('feesTitle'),
    feesSubtitle: t('feesSubtitle'),
    workshopsBadge: t('workshopsBadge'),
    workshopsTitle: t('workshopsTitle'),
    workshopsSubtitle: t('workshopsSubtitle'),
    limitedSpots: t('limitedSpots'),
    helpTitle: t('helpTitle'),
    helpSubtitle: t('helpSubtitle'),
    helpEmail: 'omar.zahour@univh2c.ma',
  }
}

function mapRegisterPageSettings(
  register: Record<string, unknown> | undefined,
  fallback: PublicRegisterPageContent
): PublicRegisterPageContent {
  if (!register) return fallback

  return {
    pageTitle: getStringSetting(register.pageTitle, fallback.pageTitle),
    pageSubtitle: getStringSetting(register.pageSubtitle, fallback.pageSubtitle),
    datesValue: getStringSetting(register.datesValue, fallback.datesValue),
    conferenceStep: getStringSetting(register.conferenceStep, fallback.conferenceStep),
    feesTitle: getStringSetting(register.feesTitle, fallback.feesTitle),
    feesSubtitle: getStringSetting(register.feesSubtitle, fallback.feesSubtitle),
    workshopsBadge: getStringSetting(register.workshopsBadge, fallback.workshopsBadge),
    workshopsTitle: getStringSetting(register.workshopsTitle, fallback.workshopsTitle),
    workshopsSubtitle: getStringSetting(register.workshopsSubtitle, fallback.workshopsSubtitle),
    limitedSpots: getStringSetting(register.limitedSpots, fallback.limitedSpots),
    helpTitle: getStringSetting(register.helpTitle, fallback.helpTitle),
    helpSubtitle: getStringSetting(register.helpSubtitle, fallback.helpSubtitle),
    helpEmail: getStringSetting(register.helpEmail, fallback.helpEmail),
  }
}

export async function getRegisterPageContentForLocale(
  locale: Locale
): Promise<PublicRegisterPageContent> {
  const fallback = await getStaticRegisterPageContent(locale)

  if (!isSupabaseConfigured()) {
    return fallback
  }

  const { data, error } = await getSiteSettings()

  if (error || !data.register) {
    return fallback
  }

  return mapRegisterPageSettings(data.register as Record<string, unknown>, fallback)
}

export type { PublicSubmissionContent }

async function getStaticSubmissionForLocale(locale: Locale): Promise<PublicSubmissionContent> {
  const t = await getTranslations({ locale, namespace: 'submission' })

  return {
    label: t('label'),
    title: t('title'),
    subtitle: t('subtitle'),
    platform: t('platform'),
    platformDesc: t('platformDesc'),
    platformUrl: DEFAULT_SUBMISSION_PLATFORM_URL,
    platformItems: [t('platform2'), t('platform3')],
    format: t('format'),
    formatDesc: t('formatDesc'),
    formatUrl: DEFAULT_SUBMISSION_FORMAT_URL,
    formatItems: [t('format1'), t('format2'), t('format3')],
    keyReqs: t('keyReqs'),
    keyReqsDesc: t('keyReqsDesc'),
    keyReqsItems: [t('keyReqs1'), t('keyReqs2'), t('keyReqs3')],
    qualityEthics: t('qualityEthics'),
    evaluationCriteria: t('evaluationCriteria'),
    evaluationItems: [t('eval1'), t('eval2'), t('eval3'), t('eval4'), t('eval5')],
    plagiarism: t('plagiarism'),
    plagiarismItems: [t('plag1'), t('plag2'), t('plag3'), t('plag4'), t('plag5')],
  }
}

async function getStaticSubmissionSettings(): Promise<SubmissionSettingsValue> {
  const [en, fr, ar] = await Promise.all([
    getStaticSubmissionForLocale('en'),
    getStaticSubmissionForLocale('fr'),
    getStaticSubmissionForLocale('ar'),
  ])

  return { en, fr, ar }
}

export async function getSubmissionForLocale(locale: Locale): Promise<PublicSubmissionContent> {
  const fallbacks = await getStaticSubmissionSettings()
  const links = isSupabaseConfigured() ? (await getSiteSettings()).data?.links : undefined

  if (!isSupabaseConfigured()) {
    return mergeSubmissionLinks(
      getSubmissionContentForLocale(fallbacks, locale),
      links as { easychair?: unknown; springerTemplate?: unknown } | undefined
    )
  }

  const { data, error } = await getSiteSettings()

  if (error || !data.submission) {
    return mergeSubmissionLinks(
      getSubmissionContentForLocale(fallbacks, locale),
      data?.links as { easychair?: unknown; springerTemplate?: unknown } | undefined
    )
  }

  const settings = normalizeSubmissionSettings(
    data.submission as Record<string, unknown>,
    fallbacks
  )

  return mergeSubmissionLinks(
    getSubmissionContentForLocale(settings, locale),
    data.links as { easychair?: unknown; springerTemplate?: unknown } | undefined
  )
}

export async function getSubmissionSettingsForAdmin(): Promise<SubmissionSettingsValue> {
  const fallbacks = await getStaticSubmissionSettings()
  const links = isSupabaseConfigured() ? (await getSiteSettings()).data?.links : undefined

  if (!isSupabaseConfigured()) {
    return {
      en: mergeSubmissionLinks(fallbacks.en, links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
      fr: mergeSubmissionLinks(fallbacks.fr, links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
      ar: mergeSubmissionLinks(fallbacks.ar, links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
    }
  }

  const { data, error } = await getSiteSettings()

  if (error || !data.submission) {
    return {
      en: mergeSubmissionLinks(fallbacks.en, data?.links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
      fr: mergeSubmissionLinks(fallbacks.fr, data?.links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
      ar: mergeSubmissionLinks(fallbacks.ar, data?.links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
    }
  }

  const settings = normalizeSubmissionSettings(
    data.submission as Record<string, unknown>,
    fallbacks
  )

  return {
    en: mergeSubmissionLinks(settings.en, data.links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
    fr: mergeSubmissionLinks(settings.fr, data.links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
    ar: mergeSubmissionLinks(settings.ar, data.links as { easychair?: unknown; springerTemplate?: unknown } | undefined),
  }
}
