'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GripVertical, Pencil } from 'lucide-react'
import { PricingFormDialog } from '@/components/admin/pricing-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { reorderPricingTiers } from '@/app/admin/(dashboard)/pricing/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PricingTierWithTranslations } from '@/types/database'
import { cn } from '@/lib/utils'

type PricingTableProps = {
  tiers: PricingTierWithTranslations[]
}

function reorderTierList(
  items: PricingTierWithTranslations[],
  draggedId: string,
  targetId: string
): PricingTierWithTranslations[] {
  const fromIndex = items.findIndex((item) => item.id === draggedId)
  const toIndex = items.findIndex((item) => item.id === targetId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return items
  }

  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function PricingTable({ tiers }: PricingTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(tiers)
  const [editingTier, setEditingTier] = useState<PricingTierWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    setItems(tiers)
  }, [tiers])

  function handleEdit(tier: PricingTierWithTranslations) {
    setEditingTier(tier)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditingTier(null)
    }
  }

  async function persistOrder(
    nextItems: PricingTierWithTranslations[],
    previousItems: PricingTierWithTranslations[]
  ) {
    setSavingOrder(true)
    const result = await reorderPricingTiers(nextItems.map((item) => item.id))
    setSavingOrder(false)

    if (result.error) {
      setItems(previousItems)
      toast.error(result.error)
      return
    }

    toast.success('Pricing order updated')
    router.refresh()
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId || savingOrder) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const previousItems = items
    const nextItems = reorderTierList(items, draggedId, targetId)
    setItems(nextItems)
    setDraggedId(null)
    setDragOverId(null)
    void persistOrder(nextItems, previousItems)
  }

  return (
    <>
      <p className="mb-3 text-xs text-muted-foreground">
        Drag rows to change the order shown on the registration page.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" aria-label="Reorder" />
            <TableHead>Plan</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((tier) => {
            const enTranslation =
              tier.pricing_tier_translations.find((t) => t.locale === 'en') ??
              tier.pricing_tier_translations[0]
            const isDragging = draggedId === tier.id
            const isDragOver = dragOverId === tier.id && draggedId !== tier.id

            return (
              <TableRow
                key={tier.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverId(tier.id)
                }}
                onDragLeave={() => {
                  if (dragOverId === tier.id) {
                    setDragOverId(null)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(tier.id)
                }}
                className={cn(
                  'transition-colors duration-200',
                  isDragging && 'opacity-50',
                  isDragOver && 'bg-muted/60'
                )}
              >
                <TableCell>
                  <button
                    type="button"
                    draggable={!savingOrder}
                    onDragStart={() => setDraggedId(tier.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setDragOverId(null)
                    }}
                    className="flex cursor-grab items-center justify-center rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Reorder ${enTranslation?.name ?? 'tier'}`}
                    disabled={savingOrder}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell className="font-medium">{enTranslation?.name ?? '—'}</TableCell>
                <TableCell>
                  {tier.price} {tier.currency}
                </TableCell>
                <TableCell>
                  <Badge variant={tier.is_featured ? 'default' : 'outline'}>
                    {tier.is_featured ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={tier.is_published ? 'default' : 'outline'}>
                    {tier.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(tier)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.name ?? 'tier'}`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <DeleteItemButton
                      action="pricing"
                      id={tier.id}
                      title="Delete pricing tier?"
                      description={`This will permanently remove "${enTranslation?.name ?? 'this tier'}".`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PricingFormDialog tier={editingTier ?? undefined} open={editOpen} onOpenChange={handleEditOpenChange} />
    </>
  )
}
