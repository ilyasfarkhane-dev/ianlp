import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { PricingFormDialog } from '@/components/admin/pricing-form-dialog'
import { PricingTable } from '@/components/admin/pricing-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'
import type { PricingTierWithTranslations } from '@/types/database'

export default async function AdminPricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: tiers, error } = await supabase
    .from('pricing_tiers')
    .select('*, pricing_tier_translations(*)')
    .order('sort_order', { ascending: true })

  const tierList = (tiers ?? []) as PricingTierWithTranslations[]

  return (
    <>
      <AdminHeader
        title="Registration Fees"
        description="Manage conference registration pricing tiers"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Conference Registration Fees</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load pricing tiers. Check your Supabase connection.'
                  : `${tierList.length} tier(s) in the database`}
              </CardDescription>
            </div>
            <PricingFormDialog />
          </CardHeader>
          <CardContent>
            {tierList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <CreditCard className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No pricing tiers yet. Add a tier or run the migration SQL.
                </p>
              </div>
            ) : (
              <PricingTable tiers={tierList} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
