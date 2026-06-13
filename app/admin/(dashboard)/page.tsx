import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminDashboard, DASHBOARD_SECTIONS, type DashboardStat } from '@/components/admin/admin-dashboard'

async function getSectionCounts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  section: (typeof DASHBOARD_SECTIONS)[number]
) {
  if ('settingsKey' in section && section.settingsKey) {
    const { data } = await supabase
      .from('site_settings')
      .select('key')
      .eq('key', section.settingsKey)
      .maybeSingle()

    return { total: data ? 1 : 0, drafts: 0 }
  }

  if ('countAsKeys' in section && section.countAsKeys) {
    const { data } = await supabase.from('site_settings').select('key')
    return { total: data?.length ?? 0, drafts: 0 }
  }

  const [{ count: total }, { count: drafts }] = await Promise.all([
    supabase.from(section.table).select('id', { count: 'exact', head: true }),
    supabase.from(section.table).select('id', { count: 'exact', head: true }).eq('is_published', false),
  ])

  return {
    total: total ?? 0,
    drafts: drafts ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const counts = await Promise.all(
    DASHBOARD_SECTIONS.map((section) => getSectionCounts(supabase, section))
  )

  const stats: DashboardStat[] = DASHBOARD_SECTIONS.map((section, index) => ({
    label: section.label,
    value: counts[index].total,
    draftCount: counts[index].drafts,
    href: section.href,
    icon: section.icon,
    description: section.description,
  }))

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of IANLP 2026 website content"
        email={user?.email}
      />
      <AdminDashboard stats={stats} userEmail={user?.email} />
    </>
  )
}
