'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LocaleFieldGroup } from '@/components/admin/locale-field-group'
import { createImportantDate, updateImportantDate } from '@/app/admin/(dashboard)/dates/actions'
import {
  LOCALES,
  type DateTab,
  type ImportantDateWithTranslations,
  type Locale,
} from '@/types/database'

type LocaleField = {
  label: string
  description: string
}

function emptyTranslations(): Record<Locale, LocaleField> {
  return {
    en: { label: '', description: '' },
    fr: { label: '', description: '' },
    ar: { label: '', description: '' },
  }
}

function dateToTranslations(date?: ImportantDateWithTranslations): Record<Locale, LocaleField> {
  const base = emptyTranslations()
  if (!date) return base

  for (const t of date.important_date_translations) {
    base[t.locale] = { label: t.label, description: t.description }
  }
  return base
}

type DateFormDialogProps = {
  date?: ImportantDateWithTranslations
  trigger?: React.ReactNode
}

export function DateFormDialog({ date, trigger }: DateFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(date?.sort_order ?? 0)
  const [tab, setTab] = useState<DateTab>(date?.tab ?? 'submission')
  const [dateValue, setDateValue] = useState(date?.date_value ?? '')
  const [isPublished, setIsPublished] = useState(date?.is_published ?? true)
  const [translations, setTranslations] = useState<Record<Locale, LocaleField>>(() =>
    dateToTranslations(date)
  )

  function handleLocaleChange(locale: Locale, field: string, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!translations.en.label.trim() || !dateValue.trim()) {
      toast.error('English label and date value are required')
      return
    }

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      tab,
      date_value: dateValue,
      is_published: isPublished,
      translations: LOCALES.map((locale) => ({
        locale,
        label: translations[locale].label,
        description: translations[locale].description,
      })),
    }

    const result = date
      ? await updateImportantDate(date.id, payload)
      : await createImportantDate(payload)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(date ? 'Date updated' : 'Date created')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Add date
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{date ? 'Edit date' : 'Add important date'}</DialogTitle>
            <DialogDescription>
              Schedule milestones for submission, review, or conference tabs.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tab">Tab</Label>
                <Select value={tab} onValueChange={(v) => setTab(v as DateTab)}>
                  <SelectTrigger id="tab" className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submission">Submission</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_value">Date display</Label>
                <Input
                  id="date_value"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  placeholder="June 13, 2026"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="published">Published</Label>
                <p className="text-xs text-muted-foreground">Visible on the public website</p>
              </div>
              <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            <LocaleFieldGroup
              values={translations}
              onChange={handleLocaleChange}
              fields={['label', 'description']}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? 'Saving…' : date ? 'Save changes' : 'Create date'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
