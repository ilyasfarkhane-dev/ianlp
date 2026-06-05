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
import { createPricingTier, updatePricingTier } from '@/app/admin/(dashboard)/pricing/actions'
import type { Json, PricingTierWithTranslations } from '@/types/database'
import { LOCALES } from '@/types/database'

function parseFeatures(value: Json | undefined): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function getTierFields(tier?: PricingTierWithTranslations) {
  const translation =
    tier?.pricing_tier_translations.find((t) => t.locale === 'en') ??
    tier?.pricing_tier_translations[0]

  return {
    name: translation?.name ?? '',
    features: parseFeatures(translation?.features).join('\n'),
  }
}

type PricingFormDialogProps = {
  tier?: PricingTierWithTranslations
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PricingFormDialog({
  tier,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: PricingFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(tier?.sort_order ?? 0)
  const [price, setPrice] = useState(tier?.price ?? '')
  const [currency, setCurrency] = useState(tier?.currency ?? 'MAD')
  const [isFeatured, setIsFeatured] = useState(tier?.is_featured ?? false)
  const [isPublished, setIsPublished] = useState(tier?.is_published ?? true)
  const [name, setName] = useState('')
  const [featuresText, setFeaturesText] = useState('')

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

    const fields = getTierFields(tier)
    setSortOrder(tier?.sort_order ?? 0)
    setPrice(tier?.price ?? '')
    setCurrency(tier?.currency ?? 'MAD')
    setIsFeatured(tier?.is_featured ?? false)
    setIsPublished(tier?.is_published ?? true)
    setName(fields.name)
    setFeaturesText(fields.features)
  }, [open, tier])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !price.trim()) {
      toast.error('Name and price are required')
      return
    }

    const features = featuresText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      price,
      currency,
      is_featured: isFeatured,
      is_published: isPublished,
      translations: LOCALES.map((locale) => ({
        locale,
        name,
        features,
      })),
    }

    const result = tier ? await updatePricingTier(tier.id, payload) : await createPricingTier(payload)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(tier ? 'Pricing tier updated' : 'Pricing tier created')
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
            Add tier
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit} className="relative" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving tier…" />
          <DialogHeader>
            <DialogTitle>{tier ? 'Edit pricing tier' : 'Add pricing tier'}</DialogTitle>
            <DialogDescription>Registration plans shown in the Conference Registration Fees section.</DialogDescription>
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
                <Label htmlFor={`${formId}-price`}>Price</Label>
                <Input
                  id={`${formId}-price`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-currency`}>Currency</Label>
                <Input
                  id={`${formId}-currency`}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="MAD"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-name`}>Plan name</Label>
              <Input
                id={`${formId}-name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="In-Person"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-features`}>Features (one per line)</Label>
              <Textarea
                id={`${formId}-features`}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Communication Certificate"
                rows={8}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor={`${formId}-featured`}>Featured plan</Label>
                <p className="text-xs text-muted-foreground">Shows the highlighted badge</p>
              </div>
              <Switch
                id={`${formId}-featured`}
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
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
              loadingText={tier ? 'Saving…' : 'Creating…'}
              className="cursor-pointer"
            >
              {tier ? 'Save changes' : 'Create tier'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
