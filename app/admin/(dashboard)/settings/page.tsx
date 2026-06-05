import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { SettingsForm } from '@/components/admin/settings-form'

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: settings } = await supabase.from('site_settings').select('key, value')

  const byKey = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]))
  const conference = (byKey.conference ?? {}) as Record<string, unknown>
  const contact = (byKey.contact ?? {}) as Record<string, unknown>
  const links = (byKey.links ?? {}) as Record<string, unknown>

  const initial = {
    countdownDate: getString(conference.countdownDate, '2026-06-29T09:00:00'),
    startDate: getString(conference.startDate, 'June 29-30, 2026'),
    venue: getString(conference.venue, "Faculty of Sciences Ben M'Sick (FSBM)"),
    email: getString(contact.email, 'omar.zahour@univh2c.ma'),
    phone: getString(contact.phone, '+212660082091'),
    easychair: getString(
      links.easychair,
      'https://easychair.org/conferences/?conf=ianlp2026'
    ),
    springerTemplate: getString(
      links.springerTemplate,
      'https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines'
    ),
  }

  return (
    <>
      <AdminHeader
        title="Site Settings"
        description="Conference details, contact info, and external links"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <SettingsForm initial={initial} />
      </main>
    </>
  )
}
