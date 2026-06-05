'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { TopicFormDialog } from '@/components/admin/topic-form-dialog'
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
import type { TopicWithTranslations } from '@/types/database'

type TopicsTableProps = {
  topics: TopicWithTranslations[]
}

export function TopicsTable({ topics }: TopicsTableProps) {
  const [editingTopic, setEditingTopic] = useState<TopicWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  function handleEdit(topic: TopicWithTranslations) {
    setEditingTopic(topic)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditingTopic(null)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic) => {
            const enTranslation =
              topic.topic_translations.find((t) => t.locale === 'en') ??
              topic.topic_translations[0]

            return (
              <TableRow key={topic.id} className="transition-colors duration-200 hover:bg-muted/50">
                <TableCell className="font-medium">{enTranslation?.title ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {topic.topic_type === 'main' ? 'Main area' : 'Focus card'}
                  </Badge>
                </TableCell>
                <TableCell>{topic.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={topic.is_published ? 'default' : 'outline'}>
                    {topic.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(topic)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.title ?? 'topic'}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteItemButton
                      action="topic"
                      id={topic.id}
                      title="Delete topic?"
                      description="This will permanently remove the topic and all translations."
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <TopicFormDialog
        topic={editingTopic ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
