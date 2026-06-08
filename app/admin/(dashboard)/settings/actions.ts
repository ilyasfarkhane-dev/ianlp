'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import { finalizeAction } from '@/lib/admin/audit-log'
import { serializeContactSettings, type ProgramChair } from '@/lib/contact-settings'

export async function updateSiteSettings(input: {
  countdownDate: string
  startDate: string
  venue: string
  emails: string[]
  phone: string
  phoneDisplay: string
  address: string
  programChairs: ProgramChair[]
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
      value: serializeContactSettings({
        emails: input.emails,
        phone: input.phone,
        phoneDisplay: input.phoneDisplay,
        address: input.address,
        programChairs: input.programChairs,
      }),
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
