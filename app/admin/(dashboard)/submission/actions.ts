'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { finalizeAction } from '@/lib/admin/audit-log'
import { getSubmissionSettingsForAdmin } from '@/lib/data/content'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import { expandSubmissionToAllLocales, serializeSubmissionSettings, type SubmissionLocaleContent } from '@/lib/submission-settings'

export async function updateSubmissionSettings(input: SubmissionLocaleContent) {
  const supabase = await createClient()
  const existing = await getSubmissionSettingsForAdmin()
  const value = serializeSubmissionSettings(expandSubmissionToAllLocales(input, existing))

  if (!value.en.title.trim()) {
    return { error: 'Title is required' }
  }

  const { error } = await supabase.from('site_settings').upsert(
    { key: 'submission', value },
    { onConflict: 'key' }
  )

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/submission')
  revalidatePath('/admin')
  revalidatePublicSite()

  return finalizeAction(
    { success: true },
    { action: 'update', resource: 'site_settings', resourceLabel: 'Submission guidelines' }
  )
}
