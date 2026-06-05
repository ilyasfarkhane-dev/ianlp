import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Pencil } from 'lucide-react'
import type { ImportantDateWithTranslations } from '@/types/database'

export default async function AdminDatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: dates, error } = await supabase
    .from('important_dates')
    .select('*, important_date_translations(*)')
    .order('sort_order', { ascending: true })

  const dateList = (dates ?? []) as ImportantDateWithTranslations[]

  return (
    <>
      <AdminHeader
        title="Important Dates"
        description="Manage submission, review, and conference milestones"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Schedule milestones</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load dates. Check your Supabase connection.'
                  : `${dateList.length} date(s) in the database`}
              </CardDescription>
            </div>
            <DateFormDialog />
          </CardHeader>
          <CardContent>
            {dateList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No dates yet. Add your first milestone.</p>
              </div>
            ) : (
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
                  {dateList.map((date) => {
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
                            <DateFormDialog
                              date={date}
                              trigger={
                                <Button variant="ghost" size="icon" className="cursor-pointer">
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              }
                            />
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
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
