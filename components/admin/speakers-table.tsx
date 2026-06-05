'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, User } from 'lucide-react'
import { SpeakerFormDialog } from '@/components/admin/speaker-form-dialog'
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
import type { SpeakerWithTranslations } from '@/types/database'

type SpeakersTableProps = {
  speakers: SpeakerWithTranslations[]
}

export function SpeakersTable({ speakers }: SpeakersTableProps) {
  const [editingSpeaker, setEditingSpeaker] = useState<SpeakerWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {speakers.map((speaker) => {
            const enTranslation =
              speaker.speaker_translations.find((t) => t.locale === 'en') ??
              speaker.speaker_translations[0]

            return (
              <TableRow key={speaker.id} className="transition-colors duration-200 hover:bg-muted/50">
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
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {speaker.category}
                  </Badge>
                </TableCell>
                <TableCell>{speaker.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={speaker.is_published ? 'default' : 'outline'}>
                    {speaker.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(speaker)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.name ?? 'speaker'}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteItemButton
                      action="speaker"
                      id={speaker.id}
                      title="Delete speaker?"
                      description="This will permanently remove the speaker and all translations."
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
