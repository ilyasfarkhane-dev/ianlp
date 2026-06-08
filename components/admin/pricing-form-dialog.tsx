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
import { createPricingTier, updatePricingTier } from '@/app/admin/(dashboard)/pricing/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import type { Json, PricingTierWithTranslations } from '@/types/database'

function parseFeatures(value: Json | undefined): string[] {
  if (!Array.isArray(value)) return ['']
  const items = value.filter((item): item is string => typeof item === 'string' && item.trim())
  return items.length > 0 ? items : ['']
}

function getTierFields(tier?: PricingTierWithTranslations) {
  const translation =
    tier?.pricing_tier_translations.find((t) => t.locale === 'en') ??
    tier?.pricing_tier_translations[0]

  return {
    name: translation?.name ?? '',
    features: parseFeatures(translation?.features),
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

type FeatureListEditorProps = {
  idPrefix: string
  items: string[]
  onChange: (items: string[]) => void
}

function FeatureListEditor({ idPrefix, items, onChange }: FeatureListEditorProps) {
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
        <div key={`${idPrefix}-feature-${index}`} className="flex gap-2">
          <Input
            id={`${idPrefix}-feature-${index}`}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Feature ${index + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(index)}
            aria-label={`Remove feature ${index + 1}`}
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
        Add feature
      </Button>
    </div>
  )
}

type PricingFormDialogProps = {
  tier?: PricingTierWithTranslations
  defaultSortOrder?: number
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PricingFormDialog({
  tier,
  defaultSortOrder = 0,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: PricingFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState(tier?.price ?? '')
  const [currency, setCurrency] = useState(tier?.currency ?? 'MAD')
  const [isFeatured, setIsFeatured] = useState(tier?.is_featured ?? false)
  const [isPublished, setIsPublished] = useState(tier?.is_published ?? true)
  const [name, setName] = useState('')
  const [features, setFeatures] = useState<string[]>([''])

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
    setPrice(tier?.price ?? '')
    setCurrency(tier?.currency ?? 'MAD')
    setIsFeatured(tier?.is_featured ?? false)
    setIsPublished(tier?.is_published ?? true)
    setName(fields.name)
    setFeatures(fields.features)
  }, [open, tier])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !price.trim()) {
      toast.error('Plan name and price are required')
      return
    }

    const featureItems = features.map((line) => line.trim()).filter(Boolean)
    const translations = buildTranslationsForAllLocales({
      name: name.trim(),
    }).map((translation) => ({
      ...translation,
      features: featureItems,
    }))

    setLoading(true)

    const result = tier
      ? await updatePricingTier(tier.id, {
          price: price.trim(),
          currency: currency.trim() || 'MAD',
          is_featured: isFeatured,
          is_published: isPublished,
          translations,
        })
      : await createPricingTier({
          sort_order: defaultSortOrder,
          price: price.trim(),
          currency: currency.trim() || 'MAD',
          is_featured: isFeatured,
          is_published: isPublished,
          translations,
        })

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
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="relative flex min-h-0 flex-1 flex-col" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving tier…" />
          <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
            <DialogTitle>{tier ? 'Edit pricing tier' : 'Add pricing tier'}</DialogTitle>
            <DialogDescription>
              Set the price and visibility on the left, plan details on the right.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <FormSection title="Basics" description="Price and visibility on the registration page.">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-price`}>
                      Price
                      <span className="ml-1 text-destructive">*</span>
                    </Label>
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
              </FormSection>

              <div className="lg:border-l lg:border-border lg:pl-8">
                <FormSection title="Content" description="Plan name and included features.">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-name`}>
                      Plan name
                      <span className="ml-1 text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${formId}-name`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="In-Person"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Features</Label>
                    <FeatureListEditor
                      idPrefix={formId}
                      items={features}
                      onChange={setFeatures}
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
