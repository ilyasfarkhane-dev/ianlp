import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { DateFormDialog } from '@/components/admin/date-form-dialog'
import { DatesTable } from '@/components/admin/dates-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
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
  const nextSortOrder =
    dateList.length > 0 ? Math.max(...dateList.map((date) => date.sort_order)) + 1 : 0

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
            <DateFormDialog defaultSortOrder={nextSortOrder} />
          </CardHeader>
          <CardContent>
            {dateList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No dates yet. Add your first milestone.</p>
              </div>
            ) : (
              <DatesTable dates={dateList} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
