export type Locale = 'en' | 'fr' | 'ar'

export type SpeakerCategory = 'keynote' | 'invited'

export type DateTab = 'submission' | 'review' | 'conference'

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

export type Speaker = Database['public']['Tables']['speakers']['Row']
export type SpeakerTranslation = Database['public']['Tables']['speaker_translations']['Row']
export type ImportantDate = Database['public']['Tables']['important_dates']['Row']
export type ImportantDateTranslation =
  Database['public']['Tables']['important_date_translations']['Row']
export type Partner = Database['public']['Tables']['partners']['Row']
export type PartnerTranslation = Database['public']['Tables']['partner_translations']['Row']
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

export const LOCALES: Locale[] = ['en', 'fr', 'ar']

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
}
