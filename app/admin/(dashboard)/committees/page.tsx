import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { CommitteesBoard } from '@/components/admin/committees-table'
import { getNextSortOrderForType } from '@/lib/admin/committees'
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
  const defaultSortOrders = {
    pc_chair: getNextSortOrderForType(memberList, 'pc_chair'),
    reviewer: getNextSortOrderForType(memberList, 'reviewer'),
    organizing: getNextSortOrderForType(memberList, 'organizing'),
  }

  return (
    <>
      <AdminHeader
        title="Committees"
        description="Manage program chairs, external reviewers, and organizing committee"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {error ? (
          <p className="text-sm text-destructive">
            Could not load committee members. Check your Supabase connection.
          </p>
        ) : null}

        <CommitteesBoard members={memberList} defaultSortOrders={defaultSortOrders} />
      </main>
    </>
  )
}
