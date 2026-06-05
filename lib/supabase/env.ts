function missingEnvMessage() {
  return (
    'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and either ' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local, ' +
    'then restart the dev server. Find values at: https://supabase.com/dashboard/project/_/settings/api'
  )
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!url) {
    throw new Error(missingEnvMessage())
  }
  return url
}

export function getSupabaseKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!key) {
    throw new Error(missingEnvMessage())
  }
  return key
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim())
  )
}
