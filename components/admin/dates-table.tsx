'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { DateFormDialog } from '@/components/admin/date-form-dialog'
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
import type { ImportantDateWithTranslations } from '@/types/database'

type DatesTableProps = {
  dates: ImportantDateWithTranslations[]
}

export function DatesTable({ dates }: DatesTableProps) {
  const [editingDate, setEditingDate] = useState<ImportantDateWithTranslations | null>(null)
  const [editOpen, setEditOpen] = useState(false)

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tab</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dates.map((date) => {
            const enTranslation =
              date.important_date_translations.find((t) => t.locale === 'en') ??
              date.important_date_translations[0]

            return (
              <TableRow key={date.id} className="transition-colors duration-200 hover:bg-muted/50">
                <TableCell className="font-medium">{enTranslation?.label ?? '—'}</TableCell>
                <TableCell>{date.date_value}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {date.tab}
                  </Badge>
                </TableCell>
                <TableCell>{date.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={date.is_published ? 'default' : 'outline'}>
                    {date.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(date)}
                      className="cursor-pointer"
                      aria-label={`Edit ${enTranslation?.label ?? 'date'}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteItemButton
                      action="date"
                      id={date.id}
                      title="Delete date?"
                      description="This will permanently remove the date and all translations."
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
