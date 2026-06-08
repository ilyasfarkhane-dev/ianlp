'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { GripVertical, Pencil } from 'lucide-react'
import { WorkshopFormDialog } from '@/components/admin/workshop-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { reorderWorkshops } from '@/app/admin/(dashboard)/register/actions'
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
import type { WorkshopWithTranslations } from '@/types/database'
import { cn } from '@/lib/utils'

type WorkshopsTableProps = {
  workshops: WorkshopWithTranslations[]
}

function reorderWorkshopList(
  items: WorkshopWithTranslations[],
  draggedId: string,
  targetId: string
): WorkshopWithTranslations[] {
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

export function WorkshopsTable({ workshops }: WorkshopsTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(workshops)
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    setItems(workshops)
  }, [workshops])

  function handleEdit(workshop: WorkshopWithTranslations) {
    setEditingWorkshop(workshop)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditingWorkshop(null)
    }
  }

  async function persistOrder(nextItems: WorkshopWithTranslations[], previousItems: WorkshopWithTranslations[]) {
    setSavingOrder(true)
    const result = await reorderWorkshops(nextItems.map((item) => item.id))
    setSavingOrder(false)

    if (result.error) {
      setItems(previousItems)
      toast.error(result.error)
      return
    }

    toast.success('Workshop order updated')
    router.refresh()
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId || savingOrder) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const previousItems = items
    const nextItems = reorderWorkshopList(items, draggedId, targetId)
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
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((workshop) => {
            const translation =
              workshop.workshop_translations.find((t) => t.locale === 'en') ??
              workshop.workshop_translations[0]
            const isDragging = draggedId === workshop.id
            const isDragOver = dragOverId === workshop.id && draggedId !== workshop.id

            return (
              <TableRow
                key={workshop.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverId(workshop.id)
                }}
                onDragLeave={() => {
                  if (dragOverId === workshop.id) {
                    setDragOverId(null)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(workshop.id)
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
                    onDragStart={() => setDraggedId(workshop.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setDragOverId(null)
                    }}
                    className="flex cursor-grab items-center justify-center rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Reorder ${translation?.title ?? 'workshop'}`}
                    disabled={savingOrder}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border border-border bg-muted">
                    {workshop.image_path ? (
                      <Image
                        src={workshop.image_path}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes="48px"
                      />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{translation?.title ?? '—'}</TableCell>
                <TableCell>{workshop.fee}</TableCell>
                <TableCell>
                  <Badge variant={workshop.is_published ? 'default' : 'secondary'}>
                    {workshop.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleEdit(workshop)}
                      aria-label={`Edit ${translation?.title ?? 'workshop'}`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <DeleteItemButton
                      action="workshop"
                      id={workshop.id}
                      title="Delete workshop?"
                      description={`This will permanently remove "${translation?.title ?? 'this workshop'}".`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <WorkshopFormDialog
        workshop={editingWorkshop ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
