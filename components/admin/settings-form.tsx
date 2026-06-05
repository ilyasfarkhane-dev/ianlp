'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSiteSettings } from '@/app/admin/(dashboard)/settings/actions'

type SettingsFormProps = {
  initial: {
    countdownDate: string
    startDate: string
    venue: string
    email: string
    phone: string
    easychair: string
    springerTemplate: string
  }
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initial)

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await updateSiteSettings(form)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Settings saved')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conference</CardTitle>
          <CardDescription>Dates and venue shown on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="countdownDate">Countdown target (ISO)</Label>
            <Input
              id="countdownDate"
              value={form.countdownDate}
              onChange={(e) => updateField('countdownDate', e.target.value)}
              placeholder="2026-06-29T09:00:00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Conference dates (display)</Label>
            <Input
              id="startDate"
              value={form.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={form.venue}
              onChange={(e) => updateField('venue', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Contact details in the footer and contact section</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>External links</CardTitle>
          <CardDescription>Submission platform and template URLs</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="easychair">EasyChair URL</Label>
            <Input
              id="easychair"
              type="url"
              value={form.easychair}
              onChange={(e) => updateField('easychair', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="springerTemplate">Springer template URL</Label>
            <Input
              id="springerTemplate"
              type="url"
              value={form.springerTemplate}
              onChange={(e) => updateField('springerTemplate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="cursor-pointer">
        {loading ? 'Saving…' : 'Save settings'}
      </Button>
    </form>
  )
}
