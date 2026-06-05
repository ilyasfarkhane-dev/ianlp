export type Locale = 'en' | 'fr' | 'ar'

export type SpeakerCategory = 'keynote' | 'invited'

export type DateTab = 'submission' | 'review' | 'conference'

export type TopicType = 'main' | 'focus'

export type CommitteeType = 'pc_chair' | 'reviewer' | 'organizing'

export type CommitteeIcon = 'user-round' | 'building-2'

export const COMMITTEE_ICONS: CommitteeIcon[] = ['user-round', 'building-2']

export const COMMITTEE_ICON_LABELS: Record<CommitteeIcon, string> = {
  'user-round': 'Person / Chair',
  'building-2': 'Institution',
}

export type FocusIcon = 'brain-circuit' | 'sparkles' | 'shield-check' | 'building-2'

export const FOCUS_ICONS: FocusIcon[] = [
  'brain-circuit',
  'sparkles',
  'shield-check',
  'building-2',
]

export const FOCUS_ICON_LABELS: Record<FocusIcon, string> = {
  'brain-circuit': 'Brain / NLP',
  sparkles: 'Sparkles / Models',
  'shield-check': 'Shield / Trust',
  'building-2': 'Building / Apps',
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      speakers: {
        Row: {
          id: string
          sort_order: number
          image_path: string | null
          category: SpeakerCategory
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sort_order?: number
          image_path?: string | null
          category?: SpeakerCategory
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sort_order?: number
          image_path?: string | null
          category?: SpeakerCategory
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      speaker_translations: {
        Row: {
          id: string
          speaker_id: string
          locale: Locale
          name: string
          affiliation: string
          bio: string
        }
        Insert: {
          id?: string
          speaker_id: string
          locale: Locale
          name: string
          affiliation?: string
          bio?: string
        }
        Update: {
          id?: string
          speaker_id?: string
          locale?: Locale
          name?: string
          affiliation?: string
          bio?: string
        }
      }
      important_dates: {
        Row: {
          id: string
          sort_order: number
          tab: DateTab
          date_value: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sort_order?: number
          tab?: DateTab
          date_value: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sort_order?: number
          tab?: DateTab
          date_value?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      important_date_translations: {
        Row: {
          id: string
          date_id: string
          locale: Locale
          label: string
          description: string
        }
        Insert: {
          id?: string
          date_id: string
          locale: Locale
          label: string
          description?: string
        }
        Update: {
          id?: string
          date_id?: string
          locale?: Locale
          label?: string
          description?: string
        }
      }
      partners: {
        Row: {
          id: string
          sort_order: number
          logo_path: string
          url: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sort_order?: number
          logo_path: string
          url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sort_order?: number
          logo_path?: string
          url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      partner_translations: {
        Row: {
          id: string
          partner_id: string
          locale: Locale
          alt_text: string
        }
        Insert: {
          id?: string
          partner_id: string
          locale: Locale
          alt_text: string
        }
        Update: {
          id?: string
          partner_id?: string
          locale?: Locale
          alt_text?: string
        }
      }
      topics: {
        Row: {
          id: string
          sort_order: number
          topic_type: TopicType
          icon: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sort_order?: number
          topic_type?: TopicType
          icon?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sort_order?: number
          topic_type?: TopicType
          icon?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      topic_translations: {
        Row: {
          id: string
          topic_id: string
          locale: Locale
          title: string
          description: string
        }
        Insert: {
          id?: string
          topic_id: string
          locale: Locale
          title: string
          description?: string
        }
        Update: {
          id?: string
          topic_id?: string
          locale?: Locale
          title?: string
          description?: string
        }
      }
      committee_members: {
        Row: {
          id: string
          sort_order: number
          committee_type: CommitteeType
          icon: string | null
          email: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sort_order?: number
          committee_type?: CommitteeType
          icon?: string | null
          email?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sort_order?: number
          committee_type?: CommitteeType
          icon?: string | null
          email?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      committee_member_translations: {
        Row: {
          id: string
          member_id: string
          locale: Locale
          name: string
          affiliation: string
          role_label: string
        }
        Insert: {
          id?: string
          member_id: string
          locale: Locale
          name: string
          affiliation?: string
          role_label?: string
        }
        Update: {
          id?: string
          member_id?: string
          locale?: Locale
          name?: string
          affiliation?: string
          role_label?: string
        }
      }
      pricing_tiers: {
        Row: {
          id: string
          sort_order: number
          price: string
          currency: string
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sort_order?: number
          price: string
          currency?: string
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sort_order?: number
          price?: string
          currency?: string
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pricing_tier_translations: {
        Row: {
          id: string
          tier_id: string
          locale: Locale
          name: string
          features: Json
        }
        Insert: {
          id?: string
          tier_id: string
          locale: Locale
          name: string
          features?: Json
        }
        Update: {
          id?: string
          tier_id?: string
          locale?: Locale
          name?: string
          features?: Json
        }
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      locale: Locale
      speaker_category: SpeakerCategory
      date_tab: DateTab
      topic_type: TopicType
      committee_type: CommitteeType
    }
  }
}

export type PublicSpeaker = {
  id: string
  name: string
  affiliation: string
  bio: string
  imagePath: string | null
  category: SpeakerCategory
}

export type PublicPartner = {
  id: string
  logoPath: string
  altText: string
  url: string | null
}

export type PublicImportantDate = {
  id: string
  tab: DateTab
  dateValue: string
  label: string
  description: string
}

export type PublicTopic = {
  id: string
  title: string
  description: string
  icon: FocusIcon | null
}

export type PublicTopicsContent = {
  mainTopics: PublicTopic[]
  focusAreas: PublicTopic[]
}

export type PublicCommitteeMember = {
  id: string
  name: string
  affiliation: string
  roleLabel: string
  email: string | null
  icon: CommitteeIcon | null
}

export type PublicCommitteesContent = {
  pcChairs: PublicCommitteeMember[]
  reviewers: PublicCommitteeMember[]
  organizing: PublicCommitteeMember[]
}

export type PublicPricingTier = {
  id: string
  name: string
  price: string
  currency: string
  features: string[]
  isFeatured: boolean
}

export type PublicContactInfo = {
  email: string
  phone: string
  phoneDisplay: string
  address: string
  generalChairName: string
  chairAffiliationPrimary: string
  chairAffiliationSecondary: string
}

export type Speaker = Database['public']['Tables']['speakers']['Row']
export type SpeakerTranslation = Database['public']['Tables']['speaker_translations']['Row']
export type ImportantDate = Database['public']['Tables']['important_dates']['Row']
export type ImportantDateTranslation =
  Database['public']['Tables']['important_date_translations']['Row']
export type Partner = Database['public']['Tables']['partners']['Row']
export type PartnerTranslation = Database['public']['Tables']['partner_translations']['Row']
export type Topic = Database['public']['Tables']['topics']['Row']
export type TopicTranslation = Database['public']['Tables']['topic_translations']['Row']
export type CommitteeMember = Database['public']['Tables']['committee_members']['Row']
export type CommitteeMemberTranslation =
  Database['public']['Tables']['committee_member_translations']['Row']
export type PricingTier = Database['public']['Tables']['pricing_tiers']['Row']
export type PricingTierTranslation =
  Database['public']['Tables']['pricing_tier_translations']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

export type SpeakerWithTranslations = Speaker & {
  speaker_translations: SpeakerTranslation[]
}

export type ImportantDateWithTranslations = ImportantDate & {
  important_date_translations: ImportantDateTranslation[]
}

export type PartnerWithTranslations = Partner & {
  partner_translations: PartnerTranslation[]
}

export type TopicWithTranslations = Topic & {
  topic_translations: TopicTranslation[]
}

export type CommitteeMemberWithTranslations = CommitteeMember & {
  committee_member_translations: CommitteeMemberTranslation[]
}

export type PricingTierWithTranslations = PricingTier & {
  pricing_tier_translations: PricingTierTranslation[]
}

export const LOCALES: Locale[] = ['en', 'fr', 'ar']

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
}
