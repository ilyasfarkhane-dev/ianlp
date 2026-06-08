import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { NavigationProgress } from '@/components/ui/navigation-progress'

export const metadata: Metadata = {
  title: 'IANLP Admin',
  description: 'Manage IANLP 2026 website content',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <NavigationProgress scope="admin" />
      <SidebarProvider>
        <AdminSidebar email={user.email} />
        <SidebarInset className="min-h-svh bg-muted/20">
          {children}
          <Toaster richColors closeButton />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
