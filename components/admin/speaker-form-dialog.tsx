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
import { CloudinaryImageUpload } from '@/components/admin/cloudinary-image-upload'
import { createSpeaker, updateSpeaker } from '@/app/admin/(dashboard)/speakers/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import type { SpeakerCategory, SpeakerWithTranslations } from '@/types/database'

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

type SpeakerFormDialogProps = {
  speaker?: SpeakerWithTranslations
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SpeakerFormDialog({
  speaker,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SpeakerFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(speaker?.sort_order ?? 0)
  const [imagePath, setImagePath] = useState(speaker?.image_path ?? '')
  const [category, setCategory] = useState<SpeakerCategory>(speaker?.category ?? 'keynote')
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
    setSortOrder(speaker?.sort_order ?? 0)
    setImagePath(speaker?.image_path ?? '')
    setCategory(speaker?.category ?? 'keynote')
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
    const payload = {
      sort_order: sortOrder,
      image_path: imagePath,
      category,
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({ name, affiliation, bio }),
    }

    const result = speaker
      ? await updateSpeaker(speaker.id, payload)
      : await createSpeaker(payload)

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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit} className="relative" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving speaker…" />
          <DialogHeader>
            <DialogTitle>{speaker ? 'Edit speaker' : 'Add speaker'}</DialogTitle>
            <DialogDescription>Manage speaker details for the public website.</DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                <Label htmlFor={`${formId}-category`}>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as SpeakerCategory)}>
                  <SelectTrigger id={`${formId}-category`} className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keynote">Keynote</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor={`${formId}-name`}>Name</Label>
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
                placeholder="Short biography"
                rows={4}
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
