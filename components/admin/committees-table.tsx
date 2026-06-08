'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GripVertical, Pencil, UserCheck } from 'lucide-react'
import { CommitteeFormDialog } from '@/components/admin/committee-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { reorderCommitteeMembers } from '@/app/admin/(dashboard)/committees/actions'
import { getCommitteeMembersByType } from '@/lib/admin/committees'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CommitteeMemberWithTranslations, CommitteeType } from '@/types/database'
import { cn } from '@/lib/utils'

type CommitteeSectionConfig = {
  committeeType: CommitteeType
  title: string
  description: string
  emptyMessage: string
}

const COMMITTEE_SECTIONS: CommitteeSectionConfig[] = [
  {
    committeeType: 'pc_chair',
    title: 'Program Committee Chairs',
    description: 'Chairs displayed in the program committee section.',
    emptyMessage: 'No program chairs yet. Add the first chair for this section.',
  },
  {
    committeeType: 'reviewer',
    title: 'External Reviewers & Advisors',
    description: 'Reviewers shown in the external reviewers grid.',
    emptyMessage: 'No external reviewers yet. Add the first reviewer for this section.',
  },
  {
    committeeType: 'organizing',
    title: 'Organizing Committee',
    description: 'Organizing cards with role labels and optional icons.',
    emptyMessage: 'No organizing committee members yet. Add the first card for this section.',
  },
]

type CommitteesBoardProps = {
  members: CommitteeMemberWithTranslations[]
  defaultSortOrders: Record<CommitteeType, number>
}

function reorderMemberList(
  items: CommitteeMemberWithTranslations[],
  draggedId: string,
  targetId: string
): CommitteeMemberWithTranslations[] {
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

function getEnglishTranslation(member: CommitteeMemberWithTranslations) {
  return (
    member.committee_member_translations.find((translation) => translation.locale === 'en') ??
    member.committee_member_translations[0]
  )
}

type CommitteeSectionProps = {
  config: CommitteeSectionConfig
  members: CommitteeMemberWithTranslations[]
  defaultSortOrder: number
  onEdit: (member: CommitteeMemberWithTranslations) => void
}

function CommitteeSection({ config, members, defaultSortOrder, onEdit }: CommitteeSectionProps) {
  const router = useRouter()
  const [items, setItems] = useState(members)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    setItems(members)
  }, [members])

  async function persistOrder(
    nextItems: CommitteeMemberWithTranslations[],
    previousItems: CommitteeMemberWithTranslations[]
  ) {
    setSavingOrder(true)
    const result = await reorderCommitteeMembers(
      config.committeeType,
      nextItems.map((item) => item.id)
    )
    setSavingOrder(false)

    if (result.error) {
      setItems(previousItems)
      toast.error(result.error)
      return
    }

    toast.success(`${config.title} order updated`)
    router.refresh()
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId || savingOrder) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const previousItems = items
    const nextItems = reorderMemberList(items, draggedId, targetId)
    setItems(nextItems)
    setDraggedId(null)
    setDragOverId(null)
    void persistOrder(nextItems, previousItems)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>
            {items.length} member(s) · {config.description}
          </CardDescription>
        </div>
        <CommitteeFormDialog
          defaultSortOrder={defaultSortOrder}
          defaultCommitteeType={config.committeeType}
          lockCommitteeType
        />
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <UserCheck className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{config.emptyMessage}</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-muted-foreground">
              Drag rows to change the order shown in this section on the website.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" aria-label="Reorder" />
                  {config.committeeType === 'organizing' ? <TableHead>Role</TableHead> : null}
                  <TableHead>Name</TableHead>
                  {config.committeeType !== 'organizing' ? (
                    <TableHead>Affiliation</TableHead>
                  ) : null}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((member) => {
                  const translation = getEnglishTranslation(member)
                  const isDragging = draggedId === member.id
                  const isDragOver = dragOverId === member.id && draggedId !== member.id

                  return (
                    <TableRow
                      key={member.id}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDragOverId(member.id)
                      }}
                      onDragLeave={() => {
                        if (dragOverId === member.id) {
                          setDragOverId(null)
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        handleDrop(member.id)
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
                          onDragStart={() => setDraggedId(member.id)}
                          onDragEnd={() => {
                            setDraggedId(null)
                            setDragOverId(null)
                          }}
                          className="flex cursor-grab items-center justify-center rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Reorder ${translation?.name ?? 'member'}`}
                          disabled={savingOrder}
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                      </TableCell>
                      {config.committeeType === 'organizing' ? (
                        <TableCell>{translation?.role_label || '—'}</TableCell>
                      ) : null}
                      <TableCell className="font-medium">{translation?.name ?? '—'}</TableCell>
                      {config.committeeType !== 'organizing' ? (
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {translation?.affiliation || '—'}
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <Badge variant={member.is_published ? 'default' : 'outline'}>
                          {member.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(member)}
                            className="cursor-pointer"
                            aria-label={`Edit ${translation?.name ?? 'member'}`}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <DeleteItemButton
                            action="committee"
                            id={member.id}
                            title="Delete committee member?"
                            description={`This will permanently remove "${translation?.name ?? 'this member'}".`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function CommitteesBoard({ members, defaultSortOrders }: CommitteesBoardProps) {
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
      {COMMITTEE_SECTIONS.map((config) => (
        <CommitteeSection
          key={config.committeeType}
          config={config}
          members={getCommitteeMembersByType(members, config.committeeType)}
          defaultSortOrder={defaultSortOrders[config.committeeType]}
          onEdit={handleEdit}
        />
      ))}

      <CommitteeFormDialog
        member={editingMember ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
