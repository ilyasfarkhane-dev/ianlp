'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Mic2,
  Settings,
  Users,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/speakers', label: 'Speakers', icon: Mic2 },
  { href: '/admin/dates', label: 'Important Dates', icon: CalendarDays },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            IA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">IANLP Admin</span>
            <span className="text-xs text-muted-foreground">Content management</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="cursor-pointer transition-colors duration-200"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Link
          href="/en/ianlp"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground',
            'transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer'
          )}
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
