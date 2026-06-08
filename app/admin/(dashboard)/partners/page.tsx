import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { PartnerFormDialog } from '@/components/admin/partner-form-dialog'
import { PartnersTable } from '@/components/admin/partners-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import type { PartnerWithTranslations } from '@/types/database'

export default async function AdminPartnersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: partners, error } = await supabase
    .from('partners')
    .select('*, partner_translations(*)')
    .order('sort_order', { ascending: true })

  const partnerList = (partners ?? []) as PartnerWithTranslations[]
  const nextSortOrder =
    partnerList.length > 0 ? Math.max(...partnerList.map((partner) => partner.sort_order)) + 1 : 0

  return (
    <>
      <AdminHeader
        title="Partners"
        description="Manage sponsor and partner logos"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>All partners</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load partners. Check your Supabase connection.'
                  : `${partnerList.length} partner(s) in the database`}
              </CardDescription>
            </div>
            <PartnerFormDialog defaultSortOrder={nextSortOrder} />
          </CardHeader>
          <CardContent>
            {partnerList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <Building2 className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No partners yet. Add your first partner.</p>
              </div>
            ) : (
              <PartnersTable partners={partnerList} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
