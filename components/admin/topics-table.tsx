'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GripVertical, Pencil, Sparkles, Tags } from 'lucide-react'
import { TopicFormDialog } from '@/components/admin/topic-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { reorderTopicsByType } from '@/app/admin/(dashboard)/topics/actions'
import { getTopicsByType } from '@/lib/admin/topics'
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
import { FOCUS_ICON_LABELS, FOCUS_ICONS, type FocusIcon, type TopicType, type TopicWithTranslations } from '@/types/database'
import { cn } from '@/lib/utils'

type TopicSectionConfig = {
  topicType: TopicType
  title: string
  description: string
  emptyMessage: string
  addLabel: string
}

const TOPIC_SECTIONS: TopicSectionConfig[] = [
  {
    topicType: 'main',
    title: 'Main Thematic Areas',
    description: 'Badge-style topics shown in the wrap grid on the topics section.',
    emptyMessage: 'No main thematic areas yet. Add the first area for this section.',
    addLabel: 'Add area',
  },
  {
    topicType: 'focus',
    title: 'Special Focus Areas',
    description: 'Icon cards with descriptions in the special focus panel.',
    emptyMessage: 'No special focus areas yet. Add the first focus card for this section.',
    addLabel: 'Add focus card',
  },
]

type TopicsBoardProps = {
  topics: TopicWithTranslations[]
  defaultSortOrders: Record<TopicType, number>
}

function getFocusIconLabel(icon: string | null): string {
  if (icon && FOCUS_ICONS.includes(icon as FocusIcon)) {
    return FOCUS_ICON_LABELS[icon as FocusIcon]
  }
  return FOCUS_ICON_LABELS.sparkles
}

function reorderTopicList(
  items: TopicWithTranslations[],
  draggedId: string,
  targetId: string
): TopicWithTranslations[] {
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

function getEnglishTranslation(topic: TopicWithTranslations) {
  return (
    topic.topic_translations.find((translation) => translation.locale === 'en') ??
    topic.topic_translations[0]
  )
}

type TopicSectionProps = {
  config: TopicSectionConfig
  topics: TopicWithTranslations[]
  defaultSortOrder: number
  onEdit: (topic: TopicWithTranslations) => void
}

function TopicSection({ config, topics, defaultSortOrder, onEdit }: TopicSectionProps) {
  const router = useRouter()
  const [items, setItems] = useState(topics)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const EmptyIcon = config.topicType === 'main' ? Tags : Sparkles

  useEffect(() => {
    setItems(topics)
  }, [topics])

  async function persistOrder(
    nextItems: TopicWithTranslations[],
    previousItems: TopicWithTranslations[]
  ) {
    setSavingOrder(true)
    const result = await reorderTopicsByType(
      config.topicType,
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
    const nextItems = reorderTopicList(items, draggedId, targetId)
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
            {items.length} topic(s) · {config.description}
          </CardDescription>
        </div>
        <TopicFormDialog
          defaultSortOrder={defaultSortOrder}
          defaultTopicType={config.topicType}
          lockTopicType
          addLabel={config.addLabel}
        />
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <EmptyIcon className="mb-3 h-10 w-10 text-muted-foreground" />
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
                  <TableHead>Title</TableHead>
                  {config.topicType === 'focus' ? <TableHead>Icon</TableHead> : null}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((topic) => {
                  const translation = getEnglishTranslation(topic)
                  const isDragging = draggedId === topic.id
                  const isDragOver = dragOverId === topic.id && draggedId !== topic.id

                  return (
                    <TableRow
                      key={topic.id}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDragOverId(topic.id)
                      }}
                      onDragLeave={() => {
                        if (dragOverId === topic.id) {
                          setDragOverId(null)
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        handleDrop(topic.id)
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
                          onDragStart={() => setDraggedId(topic.id)}
                          onDragEnd={() => {
                            setDraggedId(null)
                            setDragOverId(null)
                          }}
                          className="flex cursor-grab items-center justify-center rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Reorder ${translation?.title ?? 'topic'}`}
                          disabled={savingOrder}
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{translation?.title ?? '—'}</TableCell>
                      {config.topicType === 'focus' ? (
                        <TableCell>
                          <Badge variant="secondary">{getFocusIconLabel(topic.icon)}</Badge>
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <Badge variant={topic.is_published ? 'default' : 'outline'}>
                          {topic.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(topic)}
                            className="cursor-pointer"
                            aria-label={`Edit ${translation?.title ?? 'topic'}`}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <DeleteItemButton
                            action="topic"
                            id={topic.id}
                            title="Delete topic?"
                            description={`This will permanently remove "${translation?.title ?? 'this topic'}".`}
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

export function TopicsBoard({ topics, defaultSortOrders }: TopicsBoardProps) {
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
      {TOPIC_SECTIONS.map((config) => (
        <TopicSection
          key={config.topicType}
          config={config}
          topics={getTopicsByType(topics, config.topicType)}
          defaultSortOrder={defaultSortOrders[config.topicType]}
          onEdit={handleEdit}
        />
      ))}

      <TopicFormDialog
        topic={editingTopic ?? undefined}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
