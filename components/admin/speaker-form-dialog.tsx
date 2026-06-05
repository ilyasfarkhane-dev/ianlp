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
import { CloudinaryImageUpload } from '@/components/admin/cloudinary-image-upload'
import { createSpeaker, updateSpeaker } from '@/app/admin/(dashboard)/speakers/actions'
import { LOCALES, type Locale, type SpeakerCategory, type SpeakerWithTranslations } from '@/types/database'

type LocaleField = {
  name: string
  affiliation: string
  bio: string
}

function emptyTranslations(): Record<Locale, LocaleField> {
  return {
    en: { name: '', affiliation: '', bio: '' },
    fr: { name: '', affiliation: '', bio: '' },
    ar: { name: '', affiliation: '', bio: '' },
  }
}

function speakerToTranslations(speaker?: SpeakerWithTranslations): Record<Locale, LocaleField> {
  const base = emptyTranslations()
  if (!speaker) return base

  for (const t of speaker.speaker_translations) {
    base[t.locale] = {
      name: t.name,
      affiliation: t.affiliation,
      bio: t.bio,
    }
  }
  return base
}

type SpeakerFormDialogProps = {
  speaker?: SpeakerWithTranslations
  trigger?: React.ReactNode
}

export function SpeakerFormDialog({ speaker, trigger }: SpeakerFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(speaker?.sort_order ?? 0)
  const [imagePath, setImagePath] = useState(speaker?.image_path ?? '')
  const [category, setCategory] = useState<SpeakerCategory>(speaker?.category ?? 'keynote')
  const [isPublished, setIsPublished] = useState(speaker?.is_published ?? true)
  const [translations, setTranslations] = useState<Record<Locale, LocaleField>>(() =>
    speakerToTranslations(speaker)
  )

  function handleLocaleChange(locale: Locale, field: string, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!translations.en.name.trim()) {
      toast.error('English name is required')
      return
    }

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      image_path: imagePath,
      category,
      is_published: isPublished,
      translations: LOCALES.map((locale) => ({
        locale,
        name: translations[locale].name,
        affiliation: translations[locale].affiliation,
        bio: translations[locale].bio,
      })),
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
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Add speaker
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{speaker ? 'Edit speaker' : 'Add speaker'}</DialogTitle>
            <DialogDescription>
              Manage speaker details in English, French, and Arabic.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as SpeakerCategory)}>
                  <SelectTrigger id="category" className="cursor-pointer">
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
                <Label htmlFor="published">Published</Label>
                <p className="text-xs text-muted-foreground">Visible on the public website</p>
              </div>
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>

            <LocaleFieldGroup
              values={translations}
              onChange={handleLocaleChange}
              fields={['name', 'affiliation', 'bio']}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? 'Saving…' : speaker ? 'Save changes' : 'Create speaker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
