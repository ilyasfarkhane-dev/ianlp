'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { GripVertical, Pencil } from 'lucide-react'
import { PartnerFormDialog } from '@/components/admin/partner-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { reorderPartners } from '@/app/admin/(dashboard)/partners/actions'
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
import type { PartnerWithTranslations } from '@/types/database'
import { cn } from '@/lib/utils'

type PartnersTableProps = {
  partners: PartnerWithTranslations[]
}

function reorderPartnerList(
  items: PartnerWithTranslations[],
  draggedId: string,
  targetId: string
): PartnerWithTranslations[] {
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

export function PartnersTable({ partners }: PartnersTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(partners)
  const [editingPartner, setEditingPartner] = useState<PartnerWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    setItems(partners)
  }, [partners])

  function handleEdit(partner: PartnerWithTranslations) {
    setEditingPartner(partner)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditingPartner(null)
    }
  }

  async function persistOrder(
    nextItems: PartnerWithTranslations[],
    previousItems: PartnerWithTranslations[]
  ) {
    setSavingOrder(true)
    const result = await reorderPartners(nextItems.map((item) => item.id))
    setSavingOrder(false)

    if (result.error) {
      setItems(previousItems)
      toast.error(result.error)
      return
    }

    toast.success('Partner order updated')
    router.refresh()
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId || savingOrder) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const previousItems = items
    const nextItems = reorderPartnerList(items, draggedId, targetId)
    setItems(nextItems)
    setDraggedId(null)
    setDragOverId(null)
    void persistOrder(nextItems, previousItems)
  }

  return (
    <>
      <p className="mb-3 text-xs text-muted-foreground">
        Drag rows to change the order shown in the partners section on the website.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" aria-label="Reorder" />
            <TableHead className="w-24">Logo</TableHead>
            <TableHead>Alt text</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((partner) => {
            const enTranslation =
              partner.partner_translations.find((t) => t.locale === 'en') ??
              partner.partner_translations[0]
            const isDragging = draggedId === partner.id
            const isDragOver = dragOverId === partner.id && draggedId !== partner.id

            return (
              <TableRow
                key={partner.id}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragOverId(partner.id)
                }}
                onDragLeave={() => {
                  if (dragOverId === partner.id) {
                    setDragOverId(null)
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  handleDrop(partner.id)
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
                    onDragStart={() => setDraggedId(partner.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setDragOverId(null)
                    }}
                    className="flex cursor-grab items-center justify-center rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Reorder ${enTranslation?.alt_text ?? 'partner'}`}
                    disabled={savingOrder}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="relative h-10 w-20 overflow-hidden rounded ring-1 ring-border">
                    <Image
                      src={partner.logo_path}
                      alt={enTranslation?.alt_text ?? 'Partner'}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{enTranslation?.alt_text ?? '—'}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {partner.url ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={partner.is_published ? 'default' : 'outline'}>
                    {partner.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(partner)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.alt_text ?? 'partner'}`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <DeleteItemButton
                      action="partner"
                      id={partner.id}
                      title="Delete partner?"
                      description={`This will permanently remove "${enTranslation?.alt_text ?? 'this partner'}".`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PartnerFormDialog
        partner={editingPartner ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
