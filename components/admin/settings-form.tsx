'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CalendarDays, ExternalLink, Link2, Mail, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { FormLoadingOverlay } from '@/components/ui/form-loading-overlay'
import { LoadingButton } from '@/components/ui/loading-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSiteSettings } from '@/app/admin/(dashboard)/settings/actions'
import { createEmptyProgramChair, type ProgramChair } from '@/lib/contact-settings'
import { cn } from '@/lib/utils'

export type SiteSettingsFormValues = {
  countdownDate: string
  startDate: string
  venue: string
  emails: string[]
  phone: string
  phoneDisplay: string
  address: string
  programChairs: ProgramChair[]
  easychair: string
  springerTemplate: string
}

type SettingsFormProps = {
  initial: SiteSettingsFormValues
}

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromDatetimeLocalValue(value: string): string {
  if (!value.trim()) return ''
  return value.length === 16 ? `${value}:00` : value
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {children}
    </div>
  )
}

function FieldGroup({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initial)
  const [countdownLocal, setCountdownLocal] = useState(toDatetimeLocalValue(initial.countdownDate))

  useEffect(() => {
    setForm(initial)
    setCountdownLocal(toDatetimeLocalValue(initial.countdownDate))
  }, [initial])

  const isDirty = useMemo(
    () =>
      JSON.stringify({
        ...form,
        countdownDate: fromDatetimeLocalValue(countdownLocal),
      }) !== JSON.stringify(initial),
    [form, countdownLocal, initial]
  )

  function updateField(key: keyof SiteSettingsFormValues, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateEmail(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      emails: prev.emails.map((email, i) => (i === index ? value : email)),
    }))
  }

  function addEmail() {
    setForm((prev) => ({ ...prev, emails: [...prev.emails, ''] }))
  }

  function removeEmail(index: number) {
    setForm((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }))
  }

  function updateProgramChair(index: number, field: keyof ProgramChair, value: string) {
    setForm((prev) => ({
      ...prev,
      programChairs: prev.programChairs.map((chair, i) =>
        i === index ? { ...chair, [field]: value } : chair
      ),
    }))
  }

  function addProgramChair() {
    setForm((prev) => ({
      ...prev,
      programChairs: [...prev.programChairs, createEmptyProgramChair()],
    }))
  }

  function removeProgramChair(index: number) {
    setForm((prev) => ({
      ...prev,
      programChairs: prev.programChairs.filter((_, i) => i !== index),
    }))
  }

  function handleReset() {
    setForm(initial)
    setCountdownLocal(toDatetimeLocalValue(initial.countdownDate))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      countdownDate: fromDatetimeLocalValue(countdownLocal),
    }

    const result = await updateSiteSettings(payload)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Settings saved')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto flex w-full max-w-4xl flex-col gap-6"
      aria-busy={loading}
    >
      <FormLoadingOverlay loading={loading} label="Saving settings…" />

      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Global site content</h2>
            <p className="text-sm text-muted-foreground">
              Updates the homepage countdown, contact section, footer, and submission links.
            </p>
          </div>
          <Button asChild variant="outline" className="cursor-pointer shrink-0">
            <Link href="/en/ianlp" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Preview website
            </Link>
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <SectionIcon>
            <CalendarDays className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <div>
            <CardTitle>Conference</CardTitle>
            <CardDescription>Dates and venue shown on the homepage hero</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FieldGroup
            htmlFor="countdownDate"
            label="Countdown target"
            hint="Used for the homepage countdown timer."
          >
            <Input
              id="countdownDate"
              type="datetime-local"
              value={countdownLocal}
              onChange={(e) => setCountdownLocal(e.target.value)}
              className="cursor-pointer"
            />
          </FieldGroup>
          <FieldGroup
            htmlFor="startDate"
            label="Conference dates (display)"
            hint="Human-readable date range shown in the hero."
          >
            <Input
              id="startDate"
              value={form.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              placeholder="June 29-30, 2026"
            />
          </FieldGroup>
          <FieldGroup htmlFor="venue" label="Venue" className="sm:col-span-2">
            <Input
              id="venue"
              value={form.venue}
              onChange={(e) => updateField('venue', e.target.value)}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <SectionIcon>
            <Mail className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <div>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>Contact section and footer details</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Email addresses</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add one or more contact emails shown in the Get in Touch section and footer.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmail}
                className="cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add email
              </Button>
            </div>
            <div className="space-y-3">
              {form.emails.map((email, index) => (
                <div key={`email-${index}`} className="flex items-end gap-2">
                  <FieldGroup htmlFor={`email-${index}`} label={`Email ${index + 1}`} className="flex-1">
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder="contact@example.com"
                    />
                  </FieldGroup>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEmail(index)}
                    disabled={form.emails.length <= 1}
                    className="cursor-pointer shrink-0"
                    aria-label={`Remove email ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <FieldGroup
              htmlFor="phone"
              label="Phone (tel link)"
              hint="Digits only, used for click-to-call links."
            >
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+212660082091"
              />
            </FieldGroup>
            <FieldGroup htmlFor="phoneDisplay" label="Phone (display)" className="sm:col-span-2">
              <Input
                id="phoneDisplay"
                value={form.phoneDisplay}
                onChange={(e) => updateField('phoneDisplay', e.target.value)}
                placeholder="+212 6 60 08 20 91"
              />
            </FieldGroup>
            <FieldGroup htmlFor="address" label="Address" className="sm:col-span-2">
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                rows={3}
              />
            </FieldGroup>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Program chairs</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Shown in the Get in Touch section alongside contact details.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProgramChair}
                className="cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add chair
              </Button>
            </div>

            <div className="space-y-4">
              {form.programChairs.map((chair, index) => (
                <div
                  key={`chair-${index}`}
                  className="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">Program chair {index + 1}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeProgramChair(index)}
                      disabled={form.programChairs.length <= 1}
                      className="cursor-pointer shrink-0"
                      aria-label={`Remove program chair ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup htmlFor={`chair-name-${index}`} label="Name" className="sm:col-span-2">
                      <Input
                        id={`chair-name-${index}`}
                        value={chair.name}
                        onChange={(e) => updateProgramChair(index, 'name', e.target.value)}
                      />
                    </FieldGroup>
                    <FieldGroup htmlFor={`chair-affiliation-primary-${index}`} label="Affiliation (primary)">
                      <Input
                        id={`chair-affiliation-primary-${index}`}
                        value={chair.affiliationPrimary}
                        onChange={(e) =>
                          updateProgramChair(index, 'affiliationPrimary', e.target.value)
                        }
                      />
                    </FieldGroup>
                    <FieldGroup htmlFor={`chair-affiliation-secondary-${index}`} label="Affiliation (secondary)">
                      <Input
                        id={`chair-affiliation-secondary-${index}`}
                        value={chair.affiliationSecondary}
                        onChange={(e) =>
                          updateProgramChair(index, 'affiliationSecondary', e.target.value)
                        }
                      />
                    </FieldGroup>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <SectionIcon>
            <Link2 className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <div>
            <CardTitle>External links</CardTitle>
            <CardDescription>Submission platform and author template URLs</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <FieldGroup htmlFor="easychair" label="EasyChair URL">
            <Input
              id="easychair"
              type="url"
              value={form.easychair}
              onChange={(e) => updateField('easychair', e.target.value)}
              placeholder="https://easychair.org/conferences/?conf=ianlp2026"
            />
          </FieldGroup>
          <FieldGroup htmlFor="springerTemplate" label="Springer template URL">
            <Input
              id="springerTemplate"
              type="url"
              value={form.springerTemplate}
              onChange={(e) => updateField('springerTemplate', e.target.value)}
              placeholder="https://www.springer.com/..."
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:-mx-6 md:px-6">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading || !isDirty}
            className="cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Saving…"
            disabled={!isDirty}
            className="cursor-pointer"
          >
            Save settings
          </LoadingButton>
        </div>
      </div>
    </form>
  )
}
