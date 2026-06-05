'use server'

import { revalidatePath } from 'next/cache'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import { createClient } from '@/lib/supabase/server'
import type { DateTab, Locale } from '@/types/database'

type TranslationInput = {
  locale: Locale
  label: string
  description: string
}

export async function createImportantDate(input: {
  sort_order: number
  tab: DateTab
  date_value: string
  is_published: boolean
  translations: TranslationInput[]
}) {
  const supabase = await createClient()

  const { data: date, error } = await supabase
    .from('important_dates')
    .insert({
      sort_order: input.sort_order,
      tab: input.tab,
      date_value: input.date_value,
      is_published: input.is_published,
    })
    .select('id')
    .single()

  if (error || !date) {
    return { error: error?.message ?? 'Failed to create date' }
  }

  const { error: translationError } = await supabase.from('important_date_translations').insert(
    input.translations.map((t) => ({
      date_id: date.id,
      locale: t.locale,
      label: t.label,
      description: t.description,
    }))
  )

  if (translationError) {
    return { error: translationError.message }
  }

  revalidatePath('/admin/dates')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function updateImportantDate(
  id: string,
  input: {
    sort_order: number
    tab: DateTab
    date_value: string
    is_published: boolean
    translations: TranslationInput[]
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('important_dates')
    .update({
      sort_order: input.sort_order,
      tab: input.tab,
      date_value: input.date_value,
      is_published: input.is_published,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  for (const t of input.translations) {
    const { error: upsertError } = await supabase.from('important_date_translations').upsert(
      {
        date_id: id,
        locale: t.locale,
        label: t.label,
        description: t.description,
      },
      { onConflict: 'date_id,locale' }
    )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/admin/dates')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function deleteImportantDate(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('important_dates').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dates')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}
