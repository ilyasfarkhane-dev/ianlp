'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ExternalLink, LogOut } from 'lucide-react'
import { recordAdminLogout } from '@/app/admin/(dashboard)/auth-audit/actions'
import { createClient } from '@/lib/supabase/client'
import { getAdminNavGroups, type AdminNavItem } from '@/lib/admin/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

type NavItem = AdminNavItem

type NavGroup = {
  label: string
  items: NavItem[]
}

type AdminSidebarProps = {
  email?: string
}

const activeNavClassName = cn(
  'cursor-pointer transition-colors duration-200',
  'data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
  'data-[active=true]:hover:bg-primary/15 data-[active=true]:hover:text-primary',
  'data-[active=true]:[&>svg]:text-primary'
)

function getInitials(email?: string) {
  if (!email) return 'AD'

  const localPart = email.split('@')[0] ?? ''
  const parts = localPart.split(/[._-]+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
  }

  return localPart.slice(0, 2).toUpperCase() || 'AD'
}

function AdminNavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
        className={activeNavClassName}
      >
        <Link
          href={item.href}
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false)
            }
          }}
        >
          <Icon className="h-4 w-4" aria-hidden />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()
  const [signingOut, setSigningOut] = useState(false)
  const navGroups = getAdminNavGroups(email)

  async function handleSignOut() {
    setSigningOut(true)
    await recordAdminLogout()
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <Link
          href="/admin"
          className={cn(
            'flex items-center gap-3 rounded-lg p-2 outline-none',
            'cursor-pointer transition-colors duration-200 hover:bg-sidebar-accent',
            'focus-visible:ring-2 focus-visible:ring-sidebar-ring'
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            IA
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">IANLP Admin</span>
            <span className="truncate text-xs text-muted-foreground">Content management</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <AdminNavLink key={item.href} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="View website"
              className="cursor-pointer transition-colors duration-200"
            >
              <Link href="/en/ianlp" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden />
                <span>View website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="my-2" />

        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(email)}
            </AvatarFallback>
          </Avatar>
          {email ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-sidebar-foreground">Signed in</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          ) : null}
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              tooltip="Sign out"
              disabled={signingOut}
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false)
                }
                void handleSignOut()
              }}
              className={cn(
                'cursor-pointer transition-colors duration-200',
                'text-destructive hover:bg-destructive/10 hover:text-destructive',
                'data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive'
              )}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
