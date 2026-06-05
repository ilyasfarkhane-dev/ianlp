import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { NavigationProgress } from '@/components/ui/navigation-progress'

export const metadata: Metadata = {
  title: 'Sign in — IANLP Admin',
  robots: { index: false, follow: false },
}

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <NavigationProgress scope="admin" />
      {children}
      <Toaster richColors closeButton />
    </ThemeProvider>
  )
}
