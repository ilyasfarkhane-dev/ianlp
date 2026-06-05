'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Menu } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

type AdminHeaderProps = {
  title: string
  description?: string
  email?: string
}

export function AdminHeader({ title, description, email }: AdminHeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger className="cursor-pointer md:hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      <Separator orientation="vertical" className="h-6 md:hidden" />
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="truncate text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {email ? (
        <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="cursor-pointer transition-colors duration-200"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </header>
  )
}
