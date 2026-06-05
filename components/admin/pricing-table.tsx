'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { PricingFormDialog } from '@/components/admin/pricing-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
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

type PricingTableProps = {
  tiers: PricingTierWithTranslations[]
}

export function PricingTable({ tiers }: PricingTableProps) {
  const [editingTier, setEditingTier] = useState<PricingTierWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier) => {
            const enTranslation =
              tier.pricing_tier_translations.find((t) => t.locale === 'en') ??
              tier.pricing_tier_translations[0]

            return (
              <TableRow key={tier.id} className="transition-colors duration-200 hover:bg-muted/50">
                <TableCell className="font-medium">{enTranslation?.name ?? '—'}</TableCell>
                <TableCell>
                  {tier.price} {tier.currency}
                </TableCell>
                <TableCell>
                  <Badge variant={tier.is_featured ? 'default' : 'outline'}>
                    {tier.is_featured ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>{tier.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={tier.is_published ? 'default' : 'outline'}>
                    {tier.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tier)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.name ?? 'tier'}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteItemButton
                      action="pricing"
                      id={tier.id}
                      title="Delete pricing tier?"
                      description="This will permanently remove the tier and all translations."
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
