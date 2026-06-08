'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GripVertical, Pencil } from 'lucide-react'
import { DateFormDialog } from '@/components/admin/date-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { reorderImportantDates } from '@/app/admin/(dashboard)/dates/actions'
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
import type { ImportantDateWithTranslations } from '@/types/database'
import { cn } from '@/lib/utils'

const TAB_LABELS = {
  submission: 'Submission',
  review: 'Review',
  conference: 'Conference',
} as const

type DatesTableProps = {
  dates: ImportantDateWithTranslations[]
}

function reorderDateList(
  items: ImportantDateWithTranslations[],
  draggedId: string,
  targetId: string
): ImportantDateWithTranslations[] {
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

export function DatesTable({ dates }: DatesTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(dates)
  const [editingDate, setEditingDate] = useState<ImportantDateWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    setItems(dates)
  }, [dates])

  function handleEdit(date: ImportantDateWithTranslations) {
    setEditingDate(date)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditingDate(null)
    }
  }

  async function persistOrder(
    nextItems: ImportantDateWithTranslations[],
    previousItems: ImportantDateWithTranslations[]
  ) {
    setSavingOrder(true)
    const result = await reorderImportantDates(nextItems.map((item) => item.id))
    setSavingOrder(false)

    if (result.error) {
      setItems(previousItems)
      toast.error(result.error)
      return
    }

    toast.success('Date order updated')
    router.refresh()
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId || savingOrder) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const previousItems = items
    const nextItems = reorderDateList(items, draggedId, targetId)
    setItems(nextItems)
    setDraggedId(null)
    setDragOverId(null)
    void persistOrder(nextItems, previousItems)
  }

  return (
    <>
      <p className="mb-3 text-xs text-muted-foreground">
        Drag rows to change the order shown within each tab on the website.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" aria-label="Reorder" />
            <TableHead>Label</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tab</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((date) => {
            const enTranslation =
              date.important_date_translations.find((t) => t.locale === 'en') ??
              date.important_date_translations[0]
            const isDragging = draggedId === date.id
            const isDragOver = dragOverId === date.id && draggedId !== date.id

            return (
              <TableRow
                key={date.id}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragOverId(date.id)
                }}
                onDragLeave={() => {
                  if (dragOverId === date.id) {
                    setDragOverId(null)
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  handleDrop(date.id)
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
                    onDragStart={() => setDraggedId(date.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setDragOverId(null)
                    }}
                    className="flex cursor-grab items-center justify-center rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Reorder ${enTranslation?.label ?? 'date'}`}
                    disabled={savingOrder}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell className="font-medium">{enTranslation?.label ?? '—'}</TableCell>
                <TableCell>{date.date_value}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{TAB_LABELS[date.tab]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={date.is_published ? 'default' : 'outline'}>
                    {date.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(date)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.label ?? 'date'}`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <DeleteItemButton
                      action="date"
                      id={date.id}
                      title="Delete date?"
                      description={`This will permanently remove "${enTranslation?.label ?? 'this date'}".`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <DateFormDialog
        date={editingDate ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
