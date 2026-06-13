import { AdminHeader } from '@/components/admin/admin-header'
import { SubmissionForm } from '@/components/admin/submission-form'
import { getSubmissionSettingsForAdmin } from '@/lib/data/content'
import { createClient } from '@/lib/supabase/server'

export default async function AdminSubmissionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initial = await getSubmissionSettingsForAdmin()

  return (
    <>
      <AdminHeader
        title="Submission Guidelines"
        description="Manage the submission section on the conference homepage"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <SubmissionForm initial={initial.en} />
      </main>
    </>
  )
}
