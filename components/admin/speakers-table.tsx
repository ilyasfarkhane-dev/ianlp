'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { GripVertical, Pencil, User } from 'lucide-react'
import { SpeakerFormDialog } from '@/components/admin/speaker-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { reorderSpeakers } from '@/app/admin/(dashboard)/speakers/actions'
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
import type { SpeakerWithTranslations } from '@/types/database'
import { cn } from '@/lib/utils'

type SpeakersTableProps = {
  speakers: SpeakerWithTranslations[]
}

function reorderSpeakerList(
  items: SpeakerWithTranslations[],
  draggedId: string,
  targetId: string
): SpeakerWithTranslations[] {
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

export function SpeakersTable({ speakers }: SpeakersTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(speakers)
  const [editingSpeaker, setEditingSpeaker] = useState<SpeakerWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    setItems(speakers)
  }, [speakers])

  function handleEdit(speaker: SpeakerWithTranslations) {
    setEditingSpeaker(speaker)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditingSpeaker(null)
    }
  }

  async function persistOrder(
    nextItems: SpeakerWithTranslations[],
    previousItems: SpeakerWithTranslations[]
  ) {
    setSavingOrder(true)
    const result = await reorderSpeakers(nextItems.map((item) => item.id))
    setSavingOrder(false)

    if (result.error) {
      setItems(previousItems)
      toast.error(result.error)
      return
    }

    toast.success('Speaker order updated')
    router.refresh()
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId || savingOrder) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const previousItems = items
    const nextItems = reorderSpeakerList(items, draggedId, targetId)
    setItems(nextItems)
    setDraggedId(null)
    setDragOverId(null)
    void persistOrder(nextItems, previousItems)
  }

  return (
    <>
      <p className="mb-3 text-xs text-muted-foreground">
        Drag rows to change the order shown on the keynote speakers section.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" aria-label="Reorder" />
            <TableHead className="w-16">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Affiliation</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((speaker) => {
            const enTranslation =
              speaker.speaker_translations.find((t) => t.locale === 'en') ??
              speaker.speaker_translations[0]
            const isDragging = draggedId === speaker.id
            const isDragOver = dragOverId === speaker.id && draggedId !== speaker.id

            return (
              <TableRow
                key={speaker.id}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragOverId(speaker.id)
                }}
                onDragLeave={() => {
                  if (dragOverId === speaker.id) {
                    setDragOverId(null)
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  handleDrop(speaker.id)
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
                    onDragStart={() => setDraggedId(speaker.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setDragOverId(null)
                    }}
                    className="flex cursor-grab items-center justify-center rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Reorder ${enTranslation?.name ?? 'speaker'}`}
                    disabled={savingOrder}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell>
                  {speaker.image_path ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border">
                      <Image
                        src={speaker.image_path}
                        alt={enTranslation?.name ?? 'Speaker'}
                        fill
                        className="object-cover object-top"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{enTranslation?.name ?? '—'}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {enTranslation?.affiliation || '—'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {speaker.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={speaker.is_published ? 'default' : 'outline'}>
                    {speaker.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(speaker)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.name ?? 'speaker'}`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <DeleteItemButton
                      action="speaker"
                      id={speaker.id}
                      title="Delete speaker?"
                      description={`This will permanently remove "${enTranslation?.name ?? 'this speaker'}".`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <SpeakerFormDialog
        speaker={editingSpeaker ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
