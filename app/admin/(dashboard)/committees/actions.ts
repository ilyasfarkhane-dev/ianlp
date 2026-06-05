'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import type { CommitteeIcon, CommitteeType, Locale } from '@/types/database'

type TranslationInput = {
  locale: Locale
  name: string
  affiliation: string
  role_label: string
}

export async function createCommitteeMember(input: {
  sort_order: number
  committee_type: CommitteeType
  icon: CommitteeIcon | null
  email: string
  is_published: boolean
  translations: TranslationInput[]
}) {
  const supabase = await createClient()

  const { data: member, error } = await supabase
    .from('committee_members')
    .insert({
      sort_order: input.sort_order,
      committee_type: input.committee_type,
      icon: input.committee_type === 'organizing' ? input.icon : null,
      email: input.email.trim() || null,
      is_published: input.is_published,
    })
    .select('id')
    .single()

  if (error || !member) {
    return { error: error?.message ?? 'Failed to create committee member' }
  }

  const { error: translationError } = await supabase.from('committee_member_translations').insert(
    input.translations.map((t) => ({
      member_id: member.id,
      locale: t.locale,
      name: t.name,
      affiliation: t.affiliation,
      role_label: t.role_label,
    }))
  )

  if (translationError) {
    return { error: translationError.message }
  }

  revalidatePath('/admin/committees')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function updateCommitteeMember(
  id: string,
  input: {
    sort_order: number
    committee_type: CommitteeType
    icon: CommitteeIcon | null
    email: string
    is_published: boolean
    translations: TranslationInput[]
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('committee_members')
    .update({
      sort_order: input.sort_order,
      committee_type: input.committee_type,
      icon: input.committee_type === 'organizing' ? input.icon : null,
      email: input.email.trim() || null,
      is_published: input.is_published,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  for (const t of input.translations) {
    const { error: upsertError } = await supabase.from('committee_member_translations').upsert(
      {
        member_id: id,
        locale: t.locale,
        name: t.name,
        affiliation: t.affiliation,
        role_label: t.role_label,
      },
      { onConflict: 'member_id,locale' }
    )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/admin/committees')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}

export async function deleteCommitteeMember(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('committee_members').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/committees')
  revalidatePath('/admin')
  revalidatePublicSite()
  return { success: true }
}
