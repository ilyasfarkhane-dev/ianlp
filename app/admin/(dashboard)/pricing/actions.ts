'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { finalizeAction } from '@/lib/admin/audit-log'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import type { Locale } from '@/types/database'

type TranslationInput = {
  locale: Locale
  name: string
  features: string[]
}

export async function createPricingTier(input: {
  sort_order: number
  price: string
  currency: string
  is_featured: boolean
  is_published: boolean
  translations: TranslationInput[]
}) {
  const supabase = await createClient()

  const { data: tier, error } = await supabase
    .from('pricing_tiers')
    .insert({
      sort_order: input.sort_order,
      price: input.price,
      currency: input.currency,
      is_featured: input.is_featured,
      is_published: input.is_published,
    })
    .select('id')
    .single()

  if (error || !tier) {
    return { error: error?.message ?? 'Failed to create pricing tier' }
  }

  const { error: translationError } = await supabase.from('pricing_tier_translations').insert(
    input.translations.map((t) => ({
      tier_id: tier.id,
      locale: t.locale,
      name: t.name,
      features: t.features,
    }))
  )

  if (translationError) {
    return { error: translationError.message }
  }

  revalidatePath('/admin/pricing')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    {
      action: 'create',
      resource: 'pricing_tier',
      resourceId: tier.id,
      resourceLabel: input.translations.find((t) => t.locale === 'en')?.name,
    }
  )
}

export async function updatePricingTier(
  id: string,
  input: {
    price: string
    currency: string
    is_featured: boolean
    is_published: boolean
    translations: TranslationInput[]
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pricing_tiers')
    .update({
      price: input.price,
      currency: input.currency,
      is_featured: input.is_featured,
      is_published: input.is_published,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  for (const t of input.translations) {
    const { error: upsertError } = await supabase.from('pricing_tier_translations').upsert(
      {
        tier_id: id,
        locale: t.locale,
        name: t.name,
        features: t.features,
      },
      { onConflict: 'tier_id,locale' }
    )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/admin/pricing')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    {
      action: 'update',
      resource: 'pricing_tier',
      resourceId: id,
      resourceLabel: input.translations.find((t) => t.locale === 'en')?.name,
    }
  )
}

export async function deletePricingTier(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pricing_tiers').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/pricing')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    { action: 'delete', resource: 'pricing_tier', resourceId: id }
  )
}

export async function reorderPricingTiers(orderedIds: string[]) {
  const supabase = await createClient()

  for (let index = 0; index < orderedIds.length; index++) {
    const { error } = await supabase
      .from('pricing_tiers')
      .update({ sort_order: index })
      .eq('id', orderedIds[index])

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/pricing')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    { action: 'update', resource: 'pricing_tier', resourceLabel: 'Pricing tier order' }
  )
}
