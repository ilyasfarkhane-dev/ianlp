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

type TopicFormDialogProps = {
  topic?: TopicWithTranslations
  defaultSortOrder?: number
  defaultTopicType?: TopicType
  lockTopicType?: boolean
  addLabel?: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TopicFormDialog({
  topic,
  defaultSortOrder = 0,
  defaultTopicType = 'main',
  lockTopicType = false,
  addLabel = 'Add topic',
  trigger,
  open: controlledOpen,
  onOpenChange,
}: TopicFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [topicType, setTopicType] = useState<TopicType>(topic?.topic_type ?? defaultTopicType)
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
    setTopicType(topic?.topic_type ?? defaultTopicType)
    setIcon(parseFocusIcon(topic?.icon))
    setIsPublished(topic?.is_published ?? true)
    setTitle(fields.title)
    setDescription(fields.description)
  }, [open, topic, defaultTopicType])

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

    const translations = buildTranslationsForAllLocales({
      title: title.trim(),
      description: description.trim(),
    })

    setLoading(true)

    const sharedPayload = {
      topic_type: topicType,
      icon: topicType === 'focus' ? icon : null,
      is_published: isPublished,
      translations,
    }

    const result = topic
      ? await updateTopic(topic.id, sharedPayload)
      : await createTopic({
          sort_order: defaultSortOrder,
          ...sharedPayload,
        })

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
            {addLabel}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="relative flex min-h-0 flex-1 flex-col" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving topic…" />
          <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
            <DialogTitle>{topic ? 'Edit topic' : 'Add topic'}</DialogTitle>
            <DialogDescription>
              Set topic type and visibility on the left, title and description on the right.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <FormSection title="Basics" description="How this topic appears on the topics section.">
                {lockTopicType && !topic ? (
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground">Section</p>
                    <p className="text-sm font-medium text-foreground">
                      {topicType === 'main' ? 'Main Thematic Areas' : 'Special Focus Areas'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-topic_type`}>Type</Label>
                    <Select value={topicType} onValueChange={(value) => setTopicType(value as TopicType)}>
                      <SelectTrigger id={`${formId}-topic_type`} className="cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main thematic area</SelectItem>
                        <SelectItem value="focus">Special focus card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {topicType === 'focus' ? (
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-icon`}>Card icon</Label>
                    <Select value={icon} onValueChange={(value) => setIcon(value as FocusIcon)}>
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
                ) : null}

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
                <FormSection title="Content" description="Title and optional description for the topic.">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-title`}>
                      Title
                      <span className="ml-1 text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${formId}-title`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Natural Language Processing"
                      required
                    />
                  </div>

                  {topicType === 'focus' ? (
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-description`}>
                        Description
                        <span className="ml-1 text-destructive">*</span>
                      </Label>
                      <Textarea
                        id={`${formId}-description`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short description for the focus card"
                        rows={3}
                        required
                      />
                    </div>
                  ) : null}
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
