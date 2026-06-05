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
import { CloudinaryImageUpload } from '@/components/admin/cloudinary-image-upload'
import { createPartner, updatePartner } from '@/app/admin/(dashboard)/partners/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import type { PartnerWithTranslations } from '@/types/database'

function getPartnerFields(partner?: PartnerWithTranslations) {
  const translation =
    partner?.partner_translations.find((t) => t.locale === 'en') ??
    partner?.partner_translations[0]

  return {
    altText: translation?.alt_text ?? '',
  }
}

type PartnerFormDialogProps = {
  partner?: PartnerWithTranslations
  trigger?: React.ReactNode
}

export function PartnerFormDialog({ partner, trigger }: PartnerFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(partner?.sort_order ?? 0)
  const [logoPath, setLogoPath] = useState(partner?.logo_path ?? '')
  const [url, setUrl] = useState(partner?.url ?? '')
  const [isPublished, setIsPublished] = useState(partner?.is_published ?? true)
  const [altText, setAltText] = useState('')

  useEffect(() => {
    if (!open) return

    const fields = getPartnerFields(partner)
    setSortOrder(partner?.sort_order ?? 0)
    setLogoPath(partner?.logo_path ?? '')
    setUrl(partner?.url ?? '')
    setIsPublished(partner?.is_published ?? true)
    setAltText(fields.altText)
  }, [open, partner])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!logoPath.trim() || !altText.trim()) {
      toast.error('Logo image and alt text are required')
      return
    }

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      logo_path: logoPath,
      url,
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({ alt_text: altText }),
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
        <form onSubmit={handleSubmit} className="relative" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving partner…" />
          <DialogHeader>
            <DialogTitle>{partner ? 'Edit partner' : 'Add partner'}</DialogTitle>
            <DialogDescription>Manage sponsor and partner logos for the public website.</DialogDescription>
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
                <Label htmlFor={`${formId}-url`}>Website URL (optional)</Label>
                <Input
                  id={`${formId}-url`}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
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

            <div className="space-y-2">
              <Label htmlFor={`${formId}-alt_text`}>Alt text</Label>
              <Input
                id={`${formId}-alt_text`}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Logo description for accessibility"
                required
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
              loadingText={partner ? 'Saving…' : 'Creating…'}
              className="cursor-pointer"
            >
              {partner ? 'Save changes' : 'Create partner'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
