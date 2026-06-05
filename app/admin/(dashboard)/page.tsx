import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, ExternalLink, Mic2, Settings, Users } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [speakers, dates, partners, settings] = await Promise.all([
    supabase.from('speakers').select('id', { count: 'exact', head: true }),
    supabase.from('important_dates').select('id', { count: 'exact', head: true }),
    supabase.from('partners').select('id', { count: 'exact', head: true }),
    supabase.from('site_settings').select('key'),
  ])

  const stats = [
    {
      label: 'Speakers',
      value: speakers.count ?? 0,
      href: '/admin/speakers',
      icon: Mic2,
      description: 'Keynote and invited speakers',
    },
    {
      label: 'Important dates',
      value: dates.count ?? 0,
      href: '/admin/dates',
      icon: CalendarDays,
      description: 'Submission, review, and conference milestones',
    },
    {
      label: 'Partners',
      value: partners.count ?? 0,
      href: '/admin/partners',
      icon: Users,
      description: 'Sponsor and partner logos',
    },
    {
      label: 'Settings',
      value: settings.data?.length ?? 0,
      href: '/admin/settings',
      icon: Settings,
      description: 'Contact info, links, and conference details',
    },
  ]

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of IANLP 2026 website content"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                <Button
                  asChild
                  variant="link"
                  className="mt-3 h-auto p-0 cursor-pointer text-primary"
                >
                  <Link href={stat.href}>Manage →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Common tasks for maintaining the conference site</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/admin/speakers">Add speaker</Link>
            </Button>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/admin/dates">Edit dates</Link>
            </Button>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/admin/settings">Update contact info</Link>
            </Button>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/en/ianlp" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Preview website
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
