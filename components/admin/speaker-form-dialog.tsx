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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { CloudinaryImageUpload } from '@/components/admin/cloudinary-image-upload'
import { createSpeaker, updateSpeaker } from '@/app/admin/(dashboard)/speakers/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import type { SpeakerWithTranslations } from '@/types/database'

function getSpeakerFields(speaker?: SpeakerWithTranslations) {
  const translation =
    speaker?.speaker_translations.find((t) => t.locale === 'en') ??
    speaker?.speaker_translations[0]

  return {
    name: translation?.name ?? '',
    affiliation: translation?.affiliation ?? '',
    bio: translation?.bio ?? '',
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

type SpeakerFormDialogProps = {
  speaker?: SpeakerWithTranslations
  defaultSortOrder?: number
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SpeakerFormDialog({
  speaker,
  defaultSortOrder = 0,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SpeakerFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePath, setImagePath] = useState(speaker?.image_path ?? '')
  const [isPublished, setIsPublished] = useState(speaker?.is_published ?? true)
  const [name, setName] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [bio, setBio] = useState('')

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

    const fields = getSpeakerFields(speaker)
    setImagePath(speaker?.image_path ?? '')
    setIsPublished(speaker?.is_published ?? true)
    setName(fields.name)
    setAffiliation(fields.affiliation)
    setBio(fields.bio)
  }, [open, speaker])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    setLoading(true)
    const sharedPayload = {
      image_path: imagePath,
      category: 'keynote' as const,
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({ name, affiliation, bio }),
    }

    const result = speaker
      ? await updateSpeaker(speaker.id, sharedPayload)
      : await createSpeaker({
          sort_order: defaultSortOrder,
          ...sharedPayload,
        })

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(speaker ? 'Speaker updated' : 'Speaker created')
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
            Add speaker
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="relative flex min-h-0 flex-1 flex-col" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving speaker…" />
          <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
            <DialogTitle>{speaker ? 'Edit speaker' : 'Add speaker'}</DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <FormSection
                title="Basics"
                description="Photo and visibility settings for the speakers section."
              >
                <CloudinaryImageUpload
                  value={imagePath}
                  onChange={setImagePath}
                  folder="ianlp/speakers"
                  label="Speaker photo"
                  description="Upload a portrait photo. Stored on Cloudinary."
                  previewClassName="h-40 w-32"
                />

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
                <FormSection title="Profile" description="Name, affiliation, and biography shown on the card.">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-name`}>
                      Name
                      <span className="ml-1 text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${formId}-name`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Speaker name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-affiliation`}>Affiliation</Label>
                    <Input
                      id={`${formId}-affiliation`}
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      placeholder="University or organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-bio`}>Biography</Label>
                    <Textarea
                      id={`${formId}-bio`}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Short biography shown in the speaker dialog"
                      rows={5}
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
              loadingText={speaker ? 'Saving…' : 'Creating…'}
              className="cursor-pointer"
            >
              {speaker ? 'Save changes' : 'Create speaker'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
