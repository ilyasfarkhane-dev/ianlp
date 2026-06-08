import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { WorkshopFormDialog } from '@/components/admin/workshop-form-dialog'
import { WorkshopsTable } from '@/components/admin/workshops-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardList } from 'lucide-react'
import type { WorkshopWithTranslations } from '@/types/database'

export default async function AdminRegisterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: workshops, error } = await supabase
    .from('workshops')
    .select('*, workshop_translations(*)')
    .order('sort_order', { ascending: true })

  const workshopList = (workshops ?? []) as WorkshopWithTranslations[]
  const nextSortOrder =
    workshopList.length > 0
      ? Math.max(...workshopList.map((workshop) => workshop.sort_order)) + 1
      : 0

  return (
    <>
      <AdminHeader
        title="Registration Page"
        description="Manage conference fees and workshops"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Conference fees</CardTitle>
              <CardDescription>
                Pricing tiers are managed separately under Registration Fees.
              </CardDescription>
            </div>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/admin/pricing">Manage fees</Link>
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Workshops</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load workshops. Check your Supabase connection.'
                  : `${workshopList.length} workshop(s) in the database`}
              </CardDescription>
            </div>
            <WorkshopFormDialog defaultSortOrder={nextSortOrder} />
          </CardHeader>
          <CardContent>
            {workshopList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No workshops yet. Add your first practical workshop.
                </p>
              </div>
            ) : (
              <WorkshopsTable workshops={workshopList} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
