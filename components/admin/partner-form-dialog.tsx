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
import { LocaleFieldGroup } from '@/components/admin/locale-field-group'
import { CloudinaryImageUpload } from '@/components/admin/cloudinary-image-upload'
import { createPartner, updatePartner } from '@/app/admin/(dashboard)/partners/actions'
import { LOCALES, type Locale, type PartnerWithTranslations } from '@/types/database'

type LocaleField = {
  alt_text: string
}

function emptyTranslations(): Record<Locale, LocaleField> {
  return {
    en: { alt_text: '' },
    fr: { alt_text: '' },
    ar: { alt_text: '' },
  }
}

function partnerToTranslations(partner?: PartnerWithTranslations): Record<Locale, LocaleField> {
  const base = emptyTranslations()
  if (!partner) return base

  for (const t of partner.partner_translations) {
    base[t.locale] = { alt_text: t.alt_text }
  }
  return base
}

type PartnerFormDialogProps = {
  partner?: PartnerWithTranslations
  trigger?: React.ReactNode
}

export function PartnerFormDialog({ partner, trigger }: PartnerFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(partner?.sort_order ?? 0)
  const [logoPath, setLogoPath] = useState(partner?.logo_path ?? '')
  const [url, setUrl] = useState(partner?.url ?? '')
  const [isPublished, setIsPublished] = useState(partner?.is_published ?? true)
  const [translations, setTranslations] = useState<Record<Locale, LocaleField>>(() =>
    partnerToTranslations(partner)
  )

  function handleLocaleChange(locale: Locale, field: string, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!logoPath.trim() || !translations.en.alt_text.trim()) {
      toast.error('Logo image and English alt text are required')
      return
    }

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      logo_path: logoPath,
      url,
      is_published: isPublished,
      translations: LOCALES.map((locale) => ({
        locale,
        alt_text: translations[locale].alt_text,
      })),
    }

    const result = partner
      ? await updatePartner(partner.id, payload)
      : await createPartner(payload)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(partner ? 'Partner updated' : 'Partner created')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Add partner
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{partner ? 'Edit partner' : 'Add partner'}</DialogTitle>
            <DialogDescription>Manage sponsor and partner logos with multilingual alt text.</DialogDescription>
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
             
            </div>

            <CloudinaryImageUpload
              value={logoPath}
              onChange={setLogoPath}
              folder="ianlp/partners"
              label="Partner logo"
              description="Upload a logo with transparent or white background. Stored on Cloudinary."
              previewClassName="h-20 w-40"
              required
            />

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
              fields={['alt_text']}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? 'Saving…' : partner ? 'Save changes' : 'Create partner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
