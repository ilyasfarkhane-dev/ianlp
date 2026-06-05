'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import type { Locale } from '@/types/database'

type TranslationInput = {
  locale: Locale
  alt_text: string
}

export async function createPartner(input: {
  sort_order: number
  logo_path: string
  url: string
  is_published: boolean
  translations: TranslationInput[]
}) {
  const supabase = await createClient()

  const { data: partner, error } = await supabase
    .from('partners')
    .insert({
      sort_order: input.sort_order,
      logo_path: input.logo_path,
      url: input.url || null,
      is_published: input.is_published,
    })
    .select('id')
    .single()

  if (error || !partner) {
    return { error: error?.message ?? 'Failed to create partner' }
  }

  const { error: translationError } = await supabase.from('partner_translations').insert(
    input.translations.map((t) => ({
      partner_id: partner.id,
      locale: t.locale,
      alt_text: t.alt_text,
    }))
  )

  if (translationError) {
    return { error: translationError.message }
  }

  revalidatePath('/admin/partners')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function updatePartner(
  id: string,
  input: {
    sort_order: number
    logo_path: string
    url: string
    is_published: boolean
    translations: TranslationInput[]
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('partners')
    .update({
      sort_order: input.sort_order,
      logo_path: input.logo_path,
      url: input.url || null,
      is_published: input.is_published,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  for (const t of input.translations) {
    const { error: upsertError } = await supabase.from('partner_translations').upsert(
      {
        partner_id: id,
        locale: t.locale,
        alt_text: t.alt_text,
      },
      { onConflict: 'partner_id,locale' }
    )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/admin/partners')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function deletePartner(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('partners').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/partners')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}
