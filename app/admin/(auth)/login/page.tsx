'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FormLoadingOverlay } from '@/components/ui/form-loading-overlay'
import { LoadingButton } from '@/components/ui/loading-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { LockKeyhole } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Signed in successfully')
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">IANLP Admin</CardTitle>
          <CardDescription>Sign in to manage conference website content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="relative space-y-4" aria-busy={loading}>
            <FormLoadingOverlay loading={loading} label="Signing in…" />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Signing in…"
              className="w-full cursor-pointer"
            >
              Sign in
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
