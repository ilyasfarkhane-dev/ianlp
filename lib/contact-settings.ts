export type ProgramChair = {
  name: string
  affiliationPrimary: string
  affiliationSecondary: string
}

export type ContactSettingsValue = {
  emails: string[]
  phone: string
  phoneDisplay: string
  address: string
  programChairs: ProgramChair[]
}

export type PublicContactInfo = ContactSettingsValue

const EMPTY_CHAIR: ProgramChair = {
  name: '',
  affiliationPrimary: '',
  affiliationSecondary: '',
}

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function normalizeEmails(raw: Record<string, unknown>, fallbackEmails: string[]): string[] {
  if (Array.isArray(raw.emails)) {
    const emails = raw.emails.filter((item): item is string => typeof item === 'string' && item.trim())
    if (emails.length > 0) return emails
  }

  const legacyEmail = getString(raw.email)
  if (legacyEmail) return [legacyEmail]

  return fallbackEmails
}

function normalizeProgramChairs(
  raw: Record<string, unknown>,
  fallbackChairs: ProgramChair[]
): ProgramChair[] {
  if (Array.isArray(raw.programChairs)) {
    const chairs = raw.programChairs
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const chair = item as Record<string, unknown>
        const name = getString(chair.name)
        const affiliationPrimary = getString(chair.affiliationPrimary)
        const affiliationSecondary = getString(chair.affiliationSecondary)
        if (!name && !affiliationPrimary && !affiliationSecondary) return null
        return { name, affiliationPrimary, affiliationSecondary }
      })
      .filter((chair): chair is ProgramChair => chair !== null)

    if (chairs.length > 0) return chairs
  }

  const legacyName = getString(raw.generalChairName)
  if (legacyName) {
    return [
      {
        name: legacyName,
        affiliationPrimary: getString(raw.chairAffiliationPrimary),
        affiliationSecondary: getString(raw.chairAffiliationSecondary),
      },
    ]
  }

  return fallbackChairs
}

export function normalizeContactSettings(
  raw: Record<string, unknown> | undefined,
  fallback: ContactSettingsValue
): ContactSettingsValue {
  if (!raw) return fallback

  return {
    emails: normalizeEmails(raw, fallback.emails),
    phone: getString(raw.phone, fallback.phone),
    phoneDisplay: getString(raw.phoneDisplay, fallback.phoneDisplay),
    address: getString(raw.address, fallback.address),
    programChairs: normalizeProgramChairs(raw, fallback.programChairs),
  }
}

export function serializeContactSettings(value: ContactSettingsValue) {
  return {
    emails: value.emails.map((email) => email.trim()).filter(Boolean),
    phone: value.phone,
    phoneDisplay: value.phoneDisplay,
    address: value.address,
    programChairs: value.programChairs
      .map((chair) => ({
        name: chair.name.trim(),
        affiliationPrimary: chair.affiliationPrimary.trim(),
        affiliationSecondary: chair.affiliationSecondary.trim(),
      }))
      .filter((chair) => chair.name || chair.affiliationPrimary || chair.affiliationSecondary),
  }
}

export function createEmptyProgramChair(): ProgramChair {
  return { ...EMPTY_CHAIR }
}
