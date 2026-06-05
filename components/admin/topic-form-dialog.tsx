'use client'

import { useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { createTopic, updateTopic } from '@/app/admin/(dashboard)/topics/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import {
  FOCUS_ICON_LABELS,
  FOCUS_ICONS,
  type FocusIcon,
  type TopicType,
  type TopicWithTranslations,
} from '@/types/database'

function getTopicFields(topic?: TopicWithTranslations) {
  const translation =
    topic?.topic_translations.find((t) => t.locale === 'en') ??
    topic?.topic_translations[0]

  return {
    title: translation?.title ?? '',
    description: translation?.description ?? '',
  }
}

function parseFocusIcon(icon: string | null | undefined): FocusIcon {
  if (icon && FOCUS_ICONS.includes(icon as FocusIcon)) {
    return icon as FocusIcon
  }

  return 'sparkles'
}

type TopicFormDialogProps = {
  topic?: TopicWithTranslations
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TopicFormDialog({
  topic,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: TopicFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(topic?.sort_order ?? 0)
  const [topicType, setTopicType] = useState<TopicType>(topic?.topic_type ?? 'main')
  const [icon, setIcon] = useState<FocusIcon>(parseFocusIcon(topic?.icon))
  const [isPublished, setIsPublished] = useState(topic?.is_published ?? true)
  const [title, setTitle] = useState('')
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

    const fields = getTopicFields(topic)
    setSortOrder(topic?.sort_order ?? 0)
    setTopicType(topic?.topic_type ?? 'main')
    setIcon(parseFocusIcon(topic?.icon))
    setIsPublished(topic?.is_published ?? true)
    setTitle(fields.title)
    setDescription(fields.description)
  }, [open, topic])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (topicType === 'focus' && !description.trim()) {
      toast.error('Description is required for special focus areas')
      return
    }

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      topic_type: topicType,
      icon: topicType === 'focus' ? icon : null,
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({ title, description }),
    }

    const result = topic ? await updateTopic(topic.id, payload) : await createTopic(payload)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(topic ? 'Topic updated' : 'Topic created')
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
            Add topic
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit} className="relative" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving topic…" />
          <DialogHeader>
            <DialogTitle>{topic ? 'Edit topic' : 'Add topic'}</DialogTitle>
            <DialogDescription>
              Manage main thematic badges or special focus area cards.
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
                <Label htmlFor={`${formId}-topic_type`}>Type</Label>
                <Select value={topicType} onValueChange={(v) => setTopicType(v as TopicType)}>
                  <SelectTrigger id={`${formId}-topic_type`} className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main thematic area</SelectItem>
                    <SelectItem value="focus">Special focus card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {topicType === 'focus' ? (
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-icon`}>Icon</Label>
                  <Select value={icon} onValueChange={(v) => setIcon(v as FocusIcon)}>
                    <SelectTrigger id={`${formId}-icon`} className="cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FOCUS_ICONS.map((value) => (
                        <SelectItem key={value} value={value}>
                          {FOCUS_ICON_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="hidden sm:block" aria-hidden />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-title`}>Title</Label>
              <Input
                id={`${formId}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Natural Language Processing"
                required
              />
            </div>

            {topicType === 'focus' && (
              <div className="space-y-2">
                <Label htmlFor={`${formId}-description`}>Description</Label>
                <Textarea
                  id={`${formId}-description`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for the focus card"
                  rows={3}
                  required
                />
              </div>
            )}

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
              loadingText={topic ? 'Saving…' : 'Creating…'}
              className="cursor-pointer"
            >
              {topic ? 'Save changes' : 'Create topic'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
