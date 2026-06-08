'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { finalizeAction } from '@/lib/admin/audit-log'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import type { Locale } from '@/types/database'

type WorkshopTranslationInput = {
  locale: Locale
  badge_label: string
  title: string
  subtitle: string
  description: string
  animator: string
  animator_role: string
  program: string[]
  audience: string
}

export async function createWorkshop(input: {
  sort_order: number
  icon: string
  image_path: string
  registration_url: string
  duration: string
  fee: string
  is_published: boolean
  translations: WorkshopTranslationInput[]
}) {
  const supabase = await createClient()

  const { data: workshop, error } = await supabase
    .from('workshops')
    .insert({
      sort_order: input.sort_order,
      icon: input.icon,
      image_path: input.image_path || null,
      registration_url: input.registration_url,
      duration: input.duration,
      fee: input.fee,
      is_published: input.is_published,
    })
    .select('id')
    .single()

  if (error || !workshop) {
    return { error: error?.message ?? 'Failed to create workshop' }
  }

  const { error: translationError } = await supabase.from('workshop_translations').insert(
    input.translations.map((t) => ({
      workshop_id: workshop.id,
      locale: t.locale,
      badge_label: t.badge_label,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      animator: t.animator,
      animator_role: t.animator_role,
      program: t.program,
      audience: t.audience,
    }))
  )

  if (translationError) {
    return { error: translationError.message }
  }

  revalidatePath('/admin/register')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    {
      action: 'create',
      resource: 'workshop',
      resourceId: workshop.id,
      resourceLabel: input.translations.find((t) => t.locale === 'en')?.title,
    }
  )
}

export async function updateWorkshop(
  id: string,
  input: {
    icon: string
    image_path: string
    registration_url: string
    duration: string
    fee: string
    is_published: boolean
    translations: WorkshopTranslationInput[]
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workshops')
    .update({
      icon: input.icon,
      image_path: input.image_path || null,
      registration_url: input.registration_url,
      duration: input.duration,
      fee: input.fee,
      is_published: input.is_published,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  for (const t of input.translations) {
    const { error: upsertError } = await supabase.from('workshop_translations').upsert(
      {
        workshop_id: id,
        locale: t.locale,
        badge_label: t.badge_label,
        title: t.title,
        subtitle: t.subtitle,
        description: t.description,
        animator: t.animator,
        animator_role: t.animator_role,
        program: t.program,
        audience: t.audience,
      },
      { onConflict: 'workshop_id,locale' }
    )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/admin/register')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    {
      action: 'update',
      resource: 'workshop',
      resourceId: id,
      resourceLabel: input.translations.find((t) => t.locale === 'en')?.title,
    }
  )
}

export async function deleteWorkshop(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('workshops').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/register')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction({ success: true }, { action: 'delete', resource: 'workshop', resourceId: id })
}

export async function reorderWorkshops(orderedIds: string[]) {
  const supabase = await createClient()

  for (let index = 0; index < orderedIds.length; index++) {
    const { error } = await supabase
      .from('workshops')
      .update({ sort_order: index })
      .eq('id', orderedIds[index])

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/register')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    { action: 'update', resource: 'workshop', resourceLabel: 'Workshop order' }
  )
}
