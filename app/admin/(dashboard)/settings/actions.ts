'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import { finalizeAction } from '@/lib/admin/audit-log'

export async function updateSiteSettings(input: {
  countdownDate: string
  startDate: string
  venue: string
  email: string
  phone: string
  phoneDisplay: string
  address: string
  generalChairName: string
  chairAffiliationPrimary: string
  chairAffiliationSecondary: string
  easychair: string
  springerTemplate: string
}) {
  const supabase = await createClient()

  const updates = [
    {
      key: 'conference',
      value: {
        countdownDate: input.countdownDate,
        startDate: input.startDate,
        venue: input.venue,
      },
    },
    {
      key: 'contact',
      value: {
        email: input.email,
        phone: input.phone,
        phoneDisplay: input.phoneDisplay,
        address: input.address,
        generalChairName: input.generalChairName,
        chairAffiliationPrimary: input.chairAffiliationPrimary,
        chairAffiliationSecondary: input.chairAffiliationSecondary,
      },
    },
    {
      key: 'links',
      value: {
        easychair: input.easychair,
        springerTemplate: input.springerTemplate,
      },
    },
  ]

  for (const item of updates) {
    const { error } = await supabase.from('site_settings').upsert(
      { key: item.key, value: item.value },
      { onConflict: 'key' }
    )

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/settings')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    { action: 'update', resource: 'site_settings', resourceLabel: 'Site settings' }
  )
}
