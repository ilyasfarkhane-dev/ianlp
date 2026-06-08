import type { LucideIcon } from 'lucide-react'
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Mic2,
  ScrollText,
  Settings,
  Tags,
  UserCheck,
  Users,
} from 'lucide-react'
import { isSuperAdmin } from '@/lib/admin/super-admin'

export type AdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/speakers', label: 'Speakers', icon: Mic2 },
      { href: '/admin/dates', label: 'Important Dates', icon: CalendarDays },
      { href: '/admin/topics', label: 'Topics', icon: Tags },
      { href: '/admin/committees', label: 'Committees', icon: UserCheck },
    ],
  },
  {
    label: 'Registration',
    items: [
      { href: '/admin/pricing', label: 'Registration Fees', icon: CreditCard },
      { href: '/admin/register', label: 'Registration Page', icon: ClipboardList },
      { href: '/admin/partners', label: 'Partners', icon: Users },
    ],
  },
  {
    label: 'System',
    items: [{ href: '/admin/settings', label: 'Site Settings', icon: Settings }],
  },
]

const superAdminNavGroup: AdminNavGroup = {
  label: 'Super Admin',
  items: [{ href: '/admin/audit-logs', label: 'Action Logs', icon: ScrollText }],
}

export function getAdminNavGroups(email?: string | null): AdminNavGroup[] {
  if (!isSuperAdmin(email)) {
    return adminNavGroups
  }
  return [...adminNavGroups, superAdminNavGroup]
}

export const adminNavItems = adminNavGroups.flatMap((group) => group.items)

export function getAdminNavItem(pathname: string, email?: string | null): AdminNavItem | undefined {
  const items = getAdminNavGroups(email).flatMap((group) => group.items)
  return items.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  )
}
