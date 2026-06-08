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

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

type DateFormDialogProps = {
  date?: ImportantDateWithTranslations
  defaultSortOrder?: number
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DateFormDialog({
  date,
  defaultSortOrder = 0,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: DateFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
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
    const sharedPayload = {
      tab,
      date_value: format(selectedDate, DATE_DISPLAY_FORMAT),
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({ label, description }),
    }

    const result = date
      ? await updateImportantDate(date.id, sharedPayload)
      : await createImportantDate({
          sort_order: defaultSortOrder,
          ...sharedPayload,
        })

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
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="relative flex min-h-0 flex-1 flex-col" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving date…" />
          <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
            <DialogTitle>{date ? 'Edit date' : 'Add important date'}</DialogTitle>
            <DialogDescription>
              Set tab and date on the left, label and description on the right.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <FormSection
                title="Basics"
                description="Which tab this milestone appears under and when it occurs."
              >
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-tab`}>Tab</Label>
                  <Select value={tab} onValueChange={(value) => setTab(value as DateTab)}>
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
                  <Label htmlFor={`${formId}-date_value`}>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id={`${formId}-date_value`}
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full cursor-pointer justify-start text-left font-normal',
                          !selectedDate && 'text-muted-foreground'
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
              </FormSection>

              <div className="lg:border-l lg:border-border lg:pl-8">
                <FormSection title="Content" description="Label and optional details for this milestone.">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-label`}>
                      Label
                      <span className="ml-1 text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${formId}-label`}
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="Paper Submission Deadline"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-description`}>Description</Label>
                    <Textarea
                      id={`${formId}-description`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Additional details shown below the label"
                      rows={4}
                    />
                  </div>
                </FormSection>
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
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
