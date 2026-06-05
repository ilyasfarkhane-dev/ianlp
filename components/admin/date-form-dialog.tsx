'use client'

import { useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, isValid, parse } from 'date-fns'
import { toast } from 'sonner'
import { CalendarIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FormLoadingOverlay } from '@/components/ui/form-loading-overlay'
import { LoadingButton } from '@/components/ui/loading-button'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createImportantDate, updateImportantDate } from '@/app/admin/(dashboard)/dates/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import type { DateTab, ImportantDateWithTranslations } from '@/types/database'

const DATE_DISPLAY_FORMAT = 'MMMM d, yyyy'

function parseDateDisplay(value: string): Date | undefined {
  if (!value.trim()) return undefined

  const direct = parse(value, DATE_DISPLAY_FORMAT, new Date())
  if (isValid(direct)) return direct

  const rangeMatch = value.match(/^(.+?)-\d+,\s*(\d{4})$/)
  if (rangeMatch) {
    const start = parse(`${rangeMatch[1]}, ${rangeMatch[2]}`, DATE_DISPLAY_FORMAT, new Date())
    if (isValid(start)) return start
  }

  const iso = parse(value, 'yyyy-MM-dd', new Date())
  if (isValid(iso)) return iso

  return undefined
}

function getDateFields(date?: ImportantDateWithTranslations) {
  const translation =
    date?.important_date_translations.find((t) => t.locale === 'en') ??
    date?.important_date_translations[0]

  return {
    label: translation?.label ?? '',
    description: translation?.description ?? '',
  }
}

type DateFormDialogProps = {
  date?: ImportantDateWithTranslations
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DateFormDialog({
  date,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: DateFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(date?.sort_order ?? 0)
  const [tab, setTab] = useState<DateTab>(date?.tab ?? 'submission')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isPublished, setIsPublished] = useState(date?.is_published ?? true)
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  function setOpen(nextOpen: boolean) {
    if (isControlled) {
      onOpenChange?.(nextOpen)
    } else {
      setInternalOpen(nextOpen)
    }
  }

  useEffect(() => {
    if (!open) return

    const fields = getDateFields(date)
    setSortOrder(date?.sort_order ?? 0)
    setTab(date?.tab ?? 'submission')
    setSelectedDate(parseDateDisplay(date?.date_value ?? ''))
    setIsPublished(date?.is_published ?? true)
    setLabel(fields.label)
    setDescription(fields.description)
  }, [open, date])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!label.trim() || !selectedDate) {
      toast.error('Label and date are required')
      return
    }

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      tab,
      date_value: format(selectedDate, DATE_DISPLAY_FORMAT),
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({ label, description }),
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
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Add date
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit} className="relative" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving date…" />
          <DialogHeader>
            <DialogTitle>{date ? 'Edit date' : 'Add important date'}</DialogTitle>
            <DialogDescription>
              Schedule milestones for submission, review, or conference tabs.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`${formId}-sort_order`}>Sort order</Label>
                <Input
                  id={`${formId}-sort_order`}
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-tab`}>Tab</Label>
                <Select value={tab} onValueChange={(v) => setTab(v as DateTab)}>
                  <SelectTrigger id={`${formId}-tab`} className="cursor-pointer">
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
                <Label htmlFor={`${formId}-date_value`}>Date display</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`${formId}-date_value`}
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full cursor-pointer justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate ? format(selectedDate, DATE_DISPLAY_FORMAT) : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      defaultMonth={selectedDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-label`}>Label</Label>
              <Input
                id={`${formId}-label`}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Paper Submission Deadline"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-description`}>Description</Label>
              <Textarea
                id={`${formId}-description`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor={`${formId}-published`}>Published</Label>
                <p className="text-xs text-muted-foreground">Visible on the public website</p>
              </div>
              <Switch
                id={`${formId}-published`}
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText={date ? 'Saving…' : 'Creating…'}
              className="cursor-pointer"
            >
              {date ? 'Save changes' : 'Create date'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
