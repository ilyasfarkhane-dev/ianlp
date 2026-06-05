'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { CommitteeFormDialog } from '@/components/admin/committee-form-dialog'
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
import type { CommitteeMemberWithTranslations } from '@/types/database'

const TYPE_LABELS = {
  pc_chair: 'Program chair',
  reviewer: 'Reviewer',
  organizing: 'Organizing',
} as const

type CommitteesTableProps = {
  members: CommitteeMemberWithTranslations[]
}

export function CommitteesTable({ members }: CommitteesTableProps) {
  const [editingMember, setEditingMember] = useState<CommitteeMemberWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  function handleEdit(member: CommitteeMemberWithTranslations) {
    setEditingMember(member)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditingMember(null)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const enTranslation =
              member.committee_member_translations.find((t) => t.locale === 'en') ??
              member.committee_member_translations[0]

            return (
              <TableRow key={member.id} className="transition-colors duration-200 hover:bg-muted/50">
                <TableCell className="font-medium">{enTranslation?.name ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{TYPE_LABELS[member.committee_type]}</Badge>
                </TableCell>
                <TableCell>{member.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={member.is_published ? 'default' : 'outline'}>
                    {member.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(member)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.name ?? 'member'}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteItemButton
                      action="committee"
                      id={member.id}
                      title="Delete committee member?"
                      description="This will permanently remove the member and all translations."
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <CommitteeFormDialog
        member={editingMember ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
