import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin } from '@/lib/admin/require-super-admin'
import { AdminHeader } from '@/components/admin/admin-header'
import { AuditLogsTable } from '@/components/admin/audit-logs-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminActionLog } from '@/types/database'

export default async function AdminAuditLogsPage() {
  const user = await requireSuperAdmin()
  const supabase = await createClient()

  const { data: logs, error } = await supabase
    .from('admin_action_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    redirect('/admin')
  }

  const logList = (logs ?? []) as AdminActionLog[]

  return (
    <>
      <AdminHeader
        title="Action Logs"
        description="Track admin create, update, delete, sign in, and sign out events"
        email={user.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Last {logList.length} actions across the admin panel. Only visible to the super
              admin account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuditLogsTable logs={logList} />
          </CardContent>
        </Card>
      </main>
    </>
  )
}
