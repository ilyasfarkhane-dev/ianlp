import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ExternalLink,
  Mic2,
  Settings,
  Tags,
  UserCheck,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type DashboardStat = {
  label: string
  value: number
  draftCount: number
  href: string
  icon: LucideIcon
  description: string
}

type AdminDashboardProps = {
  stats: DashboardStat[]
  userEmail?: string
}

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon

  return (
    <Link href={stat.href} className="group block h-full cursor-pointer">
      <Card
        className={cn(
          'h-full border-border bg-card transition-colors duration-200',
          'hover:border-primary/25 hover:bg-card'
        )}
      >
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-hidden
            />
          </div>

          <div className="mt-auto space-y-1">
            <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
            <p className="text-sm font-medium text-foreground">{stat.label}</p>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {stat.description}
            </p>
            {stat.draftCount > 0 ? (
              <Badge variant="outline" className="mt-2">
                {stat.draftCount} draft{stat.draftCount === 1 ? '' : 's'}
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function AdminDashboard({ stats, userEmail }: AdminDashboardProps) {
  const totalItems = stats.reduce((sum, stat) => sum + stat.value, 0)
  const totalDrafts = stats.reduce((sum, stat) => sum + stat.draftCount, 0)

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              {userEmail ? `Welcome back` : 'Dashboard'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalItems} content item{totalItems === 1 ? '' : 's'} across {stats.length}{' '}
              sections
              {totalDrafts > 0 ? (
                <>
                  {' '}
                  · <span className="text-foreground">{totalDrafts} unpublished draft{totalDrafts === 1 ? '' : 's'}</span>
                </>
              ) : null}
            </p>
          </div>
          <Button asChild className="cursor-pointer shrink-0">
            <Link href="/en/ianlp" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Preview website
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Content overview</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a section to manage speakers, dates, topics, and other site content.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.href} stat={stat} />
          ))}
        </div>
      </section>
    </main>
  )
}

export const DASHBOARD_SECTIONS = [
  {
    key: 'speakers',
    label: 'Speakers',
    href: '/admin/speakers',
    icon: Mic2,
    description: 'Keynote and invited speakers',
    table: 'speakers',
  },
  {
    key: 'dates',
    label: 'Important dates',
    href: '/admin/dates',
    icon: CalendarDays,
    description: 'Submission, review, and conference milestones',
    table: 'important_dates',
  },
  {
    key: 'topics',
    label: 'Topics',
    href: '/admin/topics',
    icon: Tags,
    description: 'Main thematic areas and focus cards',
    table: 'topics',
  },
  {
    key: 'committees',
    label: 'Committees',
    href: '/admin/committees',
    icon: UserCheck,
    description: 'Program chairs, reviewers, and organizing committee',
    table: 'committee_members',
  },
  {
    key: 'pricing',
    label: 'Registration fees',
    href: '/admin/pricing',
    icon: CreditCard,
    description: 'Conference registration pricing tiers',
    table: 'pricing_tiers',
  },
  {
    key: 'workshops',
    label: 'Workshops',
    href: '/admin/register',
    icon: ClipboardList,
    description: 'Registration page workshops',
    table: 'workshops',
  },
  {
    key: 'partners',
    label: 'Partners',
    href: '/admin/partners',
    icon: Users,
    description: 'Sponsor and partner logos',
    table: 'partners',
  },
  {
    key: 'settings',
    label: 'Site settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Contact info, links, and conference details',
    table: 'site_settings',
    countAsKeys: true,
  },
] as const
