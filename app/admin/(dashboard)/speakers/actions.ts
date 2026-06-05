'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import type { Locale, SpeakerCategory } from '@/types/database'

type TranslationInput = {
  locale: Locale
  name: string
  affiliation: string
  bio: string
}

export async function createSpeaker(input: {
  sort_order: number
  image_path: string
  category: SpeakerCategory
  is_published: boolean
  translations: TranslationInput[]
}) {
  const supabase = await createClient()

  const { data: speaker, error } = await supabase
    .from('speakers')
    .insert({
      sort_order: input.sort_order,
      image_path: input.image_path || null,
      category: input.category,
      is_published: input.is_published,
    })
    .select('id')
    .single()

  if (error || !speaker) {
    return { error: error?.message ?? 'Failed to create speaker' }
  }

  const { error: translationError } = await supabase.from('speaker_translations').insert(
    input.translations.map((t) => ({
      speaker_id: speaker.id,
      locale: t.locale,
      name: t.name,
      affiliation: t.affiliation,
      bio: t.bio,
    }))
  )

  if (translationError) {
    return { error: translationError.message }
  }

  revalidatePath('/admin/speakers')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function updateSpeaker(
  id: string,
  input: {
    sort_order: number
    image_path: string
    category: SpeakerCategory
    is_published: boolean
    translations: TranslationInput[]
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('speakers')
    .update({
      sort_order: input.sort_order,
      image_path: input.image_path || null,
      category: input.category,
      is_published: input.is_published,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  for (const t of input.translations) {
    const { error: upsertError } = await supabase.from('speaker_translations').upsert(
      {
        speaker_id: id,
        locale: t.locale,
        name: t.name,
        affiliation: t.affiliation,
        bio: t.bio,
      },
      { onConflict: 'speaker_id,locale' }
    )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/admin/speakers')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function deleteSpeaker(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('speakers').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/speakers')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}
