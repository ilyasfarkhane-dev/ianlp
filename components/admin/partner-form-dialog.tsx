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
import { CloudinaryImageUpload } from '@/components/admin/cloudinary-image-upload'
import { createPartner, updatePartner } from '@/app/admin/(dashboard)/partners/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import type { PartnerWithTranslations } from '@/types/database'

function deriveAltTextFromLogo(logoPath: string): string {
  const filename = logoPath.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
  const cleaned = filename.replace(/[-_]/g, ' ').trim()
  return cleaned || 'Partner'
}

function getPartnerFields(partner?: PartnerWithTranslations) {
  const translation =
    partner?.partner_translations.find((t) => t.locale === 'en') ??
    partner?.partner_translations[0]

  return {
    altText: translation?.alt_text ?? '',
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

type PartnerFormDialogProps = {
  partner?: PartnerWithTranslations
  defaultSortOrder?: number
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PartnerFormDialog({
  partner,
  defaultSortOrder = 0,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: PartnerFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoPath, setLogoPath] = useState(partner?.logo_path ?? '')
  const [url, setUrl] = useState(partner?.url ?? '')
  const [isPublished, setIsPublished] = useState(partner?.is_published ?? true)
  const [altText, setAltText] = useState('')

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

    const fields = getPartnerFields(partner)
    setLogoPath(partner?.logo_path ?? '')
    setUrl(partner?.url ?? '')
    setIsPublished(partner?.is_published ?? true)
    setAltText(fields.altText)
  }, [open, partner])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!logoPath.trim()) {
      toast.error('Logo image is required')
      return
    }

    const resolvedAltText = altText.trim() || deriveAltTextFromLogo(logoPath)

    setLoading(true)
    const sharedPayload = {
      logo_path: logoPath,
      url: url.trim(),
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({ alt_text: resolvedAltText }),
    }

    const result = partner
      ? await updatePartner(partner.id, sharedPayload)
      : await createPartner({
          sort_order: defaultSortOrder,
          ...sharedPayload,
        })

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
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Add partner
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="relative flex min-h-0 flex-1 flex-col" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving partner…" />
          <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
            <DialogTitle>{partner ? 'Edit partner' : 'Add partner'}</DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <FormSection
                title="Basics"
                description="Logo and visibility settings for the partners section."
              >
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
                <FormSection title="Details" description="Accessibility label and optional website link.">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-alt_text`}>Alt text</Label>
                    <Input
                      id={`${formId}-alt_text`}
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Partner organization name"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to derive from the logo filename.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-url`}>Website URL</Label>
                    <Input
                      id={`${formId}-url`}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
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
