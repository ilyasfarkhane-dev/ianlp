'use client'

import { useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
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
import { createWorkshop, updateWorkshop } from '@/app/admin/(dashboard)/register/actions'
import { CloudinaryImageUpload } from '@/components/admin/cloudinary-image-upload'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import type { Json, WorkshopIcon, WorkshopWithTranslations } from '@/types/database'
import { WORKSHOP_ICONS } from '@/types/database'

function parseProgram(value: Json | undefined): string[] {
  if (!Array.isArray(value)) return ['']
  const items = value.filter((item): item is string => typeof item === 'string' && item.trim())
  return items.length > 0 ? items : ['']
}

function parseWorkshopIcon(icon: string | null | undefined): WorkshopIcon {
  if (icon && WORKSHOP_ICONS.includes(icon as WorkshopIcon)) {
    return icon as WorkshopIcon
  }
  return 'video'
}

function getWorkshopFields(workshop?: WorkshopWithTranslations) {
  const translation =
    workshop?.workshop_translations.find((t) => t.locale === 'en') ??
    workshop?.workshop_translations[0]

  return {
    badgeLabel: translation?.badge_label ?? '',
    title: translation?.title ?? '',
    subtitle: translation?.subtitle ?? '',
    description: translation?.description ?? '',
    animator: translation?.animator ?? '',
    animatorRole: translation?.animator_role ?? '',
    program: parseProgram(translation?.program),
    audience: translation?.audience ?? '',
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

type ProgramListEditorProps = {
  idPrefix: string
  items: string[]
  onChange: (items: string[]) => void
}

function ProgramListEditor({ idPrefix, items, onChange }: ProgramListEditorProps) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }

  function addItem() {
    onChange([...items, ''])
  }

  function removeItem(index: number) {
    if (items.length === 1) {
      onChange([''])
      return
    }
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${idPrefix}-program-${index}`} className="flex gap-2">
          <Input
            id={`${idPrefix}-program-${index}`}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Program item ${index + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(index)}
            aria-label={`Remove program item ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={addItem}
      >
        <Plus className="h-4 w-4" />
        Add program item
      </Button>
    </div>
  )
}

type WorkshopFormDialogProps = {
  workshop?: WorkshopWithTranslations
  defaultSortOrder?: number
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WorkshopFormDialog({
  workshop,
  defaultSortOrder = 0,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: WorkshopFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePath, setImagePath] = useState(workshop?.image_path ?? '')
  const [registrationUrl, setRegistrationUrl] = useState(workshop?.registration_url ?? '')
  const [duration, setDuration] = useState(workshop?.duration ?? '')
  const [fee, setFee] = useState(workshop?.fee ?? '')
  const [isPublished, setIsPublished] = useState(workshop?.is_published ?? true)
  const [badgeLabel, setBadgeLabel] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [animator, setAnimator] = useState('')
  const [animatorRole, setAnimatorRole] = useState('')
  const [program, setProgram] = useState<string[]>([''])
  const [audience, setAudience] = useState('')

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

    const fields = getWorkshopFields(workshop)
    setImagePath(workshop?.image_path ?? '')
    setRegistrationUrl(workshop?.registration_url ?? '')
    setDuration(workshop?.duration ?? '')
    setFee(workshop?.fee ?? '')
    setIsPublished(workshop?.is_published ?? true)
    setBadgeLabel(fields.badgeLabel)
    setTitle(fields.title)
    setSubtitle(fields.subtitle)
    setDescription(fields.description)
    setAnimator(fields.animator)
    setAnimatorRole(fields.animatorRole)
    setProgram(fields.program)
    setAudience(fields.audience)
  }, [open, workshop])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (isPublished && !registrationUrl.trim()) {
      toast.error('Registration URL is required for published workshops')
      return
    }

    const programItems = program.map((line) => line.trim()).filter(Boolean)
    const translations = buildTranslationsForAllLocales({
      badge_label: badgeLabel.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      animator: animator.trim(),
      animator_role: animatorRole.trim(),
      audience: audience.trim(),
    }).map((translation) => ({
      ...translation,
      program: programItems,
    }))

    setLoading(true)

    const result = workshop
      ? await updateWorkshop(workshop.id, {
          icon: parseWorkshopIcon(workshop.icon),
          image_path: imagePath,
          registration_url: registrationUrl.trim(),
          duration: duration.trim(),
          fee: fee.trim(),
          is_published: isPublished,
          translations,
        })
      : await createWorkshop({
          sort_order: defaultSortOrder,
          icon: 'video',
          image_path: imagePath,
          registration_url: registrationUrl.trim(),
          duration: duration.trim(),
          fee: fee.trim(),
          is_published: isPublished,
          translations,
        })

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(workshop ? 'Workshop updated' : 'Workshop created')
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
            Add workshop
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="flex max-h-[85vh] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <form onSubmit={handleSubmit} className="relative flex min-h-0 flex-1 flex-col" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving workshop…" />
          <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
            <DialogTitle>{workshop ? 'Edit workshop' : 'Add workshop'}</DialogTitle>
            <DialogDescription>
              Logistics and headline content on the left, program details on the right.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-6">
              <FormSection
                title="Basics"
                description="Logistics shown on every workshop card."
              >
                <CloudinaryImageUpload
                  value={imagePath}
                  onChange={setImagePath}
                  folder="ianlp/workshops"
                  label="Cover image"
                  description="Shown at the top of the workshop card."
                  previewClassName="h-28 w-full"
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-duration`}>Duration</Label>
                    <Input
                      id={`${formId}-duration`}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="2h00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-fee`}>Fee</Label>
                    <Input
                      id={`${formId}-fee`}
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      placeholder="200 DH"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${formId}-registration_url`}>
                    Registration URL
                    {!isPublished ? (
                      <span className="ml-1 font-normal text-muted-foreground">(optional for drafts)</span>
                    ) : null}
                  </Label>
                  <Input
                    id={`${formId}-registration_url`}
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="https://..."
                    required={isPublished}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id={`${formId}-published`}
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor={`${formId}-published`}>Published on website</Label>
                </div>
              </FormSection>

              <FormSection title="Content" description="Headline text for the workshop card.">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-badge`}>Badge label</Label>
                    <Input
                      id={`${formId}-badge`}
                      value={badgeLabel}
                      onChange={(e) => setBadgeLabel(e.target.value)}
                      placeholder="Workshop 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-title`}>
                      Title
                      <span className="ml-1 text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${formId}-title`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${formId}-subtitle`}>Subtitle</Label>
                  <Input
                    id={`${formId}-subtitle`}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${formId}-description`}>Description</Label>
                  <Textarea
                    id={`${formId}-description`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              </FormSection>
            </div>

            <div className="lg:border-l lg:border-border lg:pl-8">
              <FormSection title="Content" description="Facilitator, program, and audience details.">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-animator`}>Facilitator name</Label>
                    <Input
                      id={`${formId}-animator`}
                      value={animator}
                      onChange={(e) => setAnimator(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-animator_role`}>Facilitator role</Label>
                    <Input
                      id={`${formId}-animator_role`}
                      value={animatorRole}
                      onChange={(e) => setAnimatorRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Program</Label>
                  <ProgramListEditor
                    idPrefix={formId}
                    items={program}
                    onChange={setProgram}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${formId}-audience`}>Audience</Label>
                  <Textarea
                    id={`${formId}-audience`}
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    rows={2}
                  />
                </div>
              </FormSection>
            </div>
          </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
            <LoadingButton type="submit" loading={loading}>
              {workshop ? 'Save changes' : 'Create workshop'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
