'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { getAdminNavItem } from '@/lib/admin/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

type AdminHeaderProps = {
  title: string
  description?: string
  email?: string
}

function getInitials(email?: string) {
  if (!email) return 'AD'

  const localPart = email.split('@')[0] ?? ''
  const parts = localPart.split(/[._-]+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
  }

  return localPart.slice(0, 2).toUpperCase() || 'AD'
}

export function AdminHeader({ title, description, email }: AdminHeaderProps) {
  const pathname = usePathname()
  const currentNav = getAdminNavItem(pathname, email)
  const showBreadcrumb = pathname !== '/admin'

  return (
    <header className="sticky top-0 z-10 shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-2 px-4 md:h-16 md:gap-3 md:px-6">
        <SidebarTrigger className="cursor-pointer shrink-0" />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <div className="min-w-0 flex-1">
          {showBreadcrumb ? (
            <nav
              aria-label="Breadcrumb"
              className="mb-0.5 flex items-center gap-1 text-xs text-muted-foreground"
            >
              <Link
                href="/admin"
                className="cursor-pointer transition-colors duration-200 hover:text-foreground"
              >
                Admin
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate font-medium text-foreground">
                {currentNav?.label ?? title}
              </span>
            </nav>
          ) : null}

          <div className="flex min-w-0 items-center gap-2">
            {currentNav ? (
              <currentNav.icon
                className={cn(
                  'hidden h-4 w-4 shrink-0 text-primary sm:block',
                  !showBreadcrumb && 'sm:hidden'
                )}
                aria-hidden
              />
            ) : null}
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-foreground md:text-lg">
                {title}
              </h1>
              {description ? (
                <p className="hidden truncate text-sm text-muted-foreground md:block">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer hidden sm:inline-flex"
          >
            <Link href="/en/ianlp" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="cursor-pointer sm:hidden"
          >
            <Link
              href="/en/ianlp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Preview website"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>

          {email ? (
            <Avatar className="h-8 w-8" title={email}>
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(email)}
              </AvatarFallback>
            </Avatar>
          ) : null}
        </div>
      </div>
    </header>
  )
}
