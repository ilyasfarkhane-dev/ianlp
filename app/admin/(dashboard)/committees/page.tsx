import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { CommitteeFormDialog } from '@/components/admin/committee-form-dialog'
import { CommitteesTable } from '@/components/admin/committees-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-react'
import type { CommitteeMemberWithTranslations } from '@/types/database'

export default async function AdminCommitteesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: members, error } = await supabase
    .from('committee_members')
    .select('*, committee_member_translations(*)')
    .order('sort_order', { ascending: true })

  const memberList = (members ?? []) as CommitteeMemberWithTranslations[]

  return (
    <>
      <AdminHeader
        title="Committees"
        description="Manage program chairs, reviewers, and organizing committee"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Committee members</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load committee members. Check your Supabase connection.'
                  : `${memberList.length} member(s) in the database`}
              </CardDescription>
            </div>
            <CommitteeFormDialog />
          </CardHeader>
          <CardContent>
            {memberList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <UserCheck className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No committee members yet. Add your first member or run the migration SQL.
                </p>
              </div>
            ) : (
              <CommitteesTable members={memberList} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
