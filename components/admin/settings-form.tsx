'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FormLoadingOverlay } from '@/components/ui/form-loading-overlay'
import { LoadingButton } from '@/components/ui/loading-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSiteSettings } from '@/app/admin/(dashboard)/settings/actions'

type SettingsFormProps = {
  initial: {
    countdownDate: string
    startDate: string
    venue: string
    email: string
    phone: string
    phoneDisplay: string
    address: string
    generalChairName: string
    chairAffiliationPrimary: string
    chairAffiliationSecondary: string
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
    <form onSubmit={handleSubmit} className="relative space-y-6" aria-busy={loading}>
      <FormLoadingOverlay loading={loading} label="Saving settings…" />
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
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>Contact section and footer details</CardDescription>
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
            <Label htmlFor="phone">Phone (tel link)</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+212660082091"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="phoneDisplay">Phone (display)</Label>
            <Input
              id="phoneDisplay"
              value={form.phoneDisplay}
              onChange={(e) => updateField('phoneDisplay', e.target.value)}
              placeholder="+212 6 60 08 20 91"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="generalChairName">General chair name</Label>
            <Input
              id="generalChairName"
              value={form.generalChairName}
              onChange={(e) => updateField('generalChairName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chairAffiliationPrimary">Chair affiliation (primary)</Label>
            <Input
              id="chairAffiliationPrimary"
              value={form.chairAffiliationPrimary}
              onChange={(e) => updateField('chairAffiliationPrimary', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chairAffiliationSecondary">Chair affiliation (secondary)</Label>
            <Input
              id="chairAffiliationSecondary"
              value={form.chairAffiliationSecondary}
              onChange={(e) => updateField('chairAffiliationSecondary', e.target.value)}
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

      <LoadingButton type="submit" loading={loading} loadingText="Saving…" className="cursor-pointer">
        Save settings
      </LoadingButton>
    </form>
  )
}
