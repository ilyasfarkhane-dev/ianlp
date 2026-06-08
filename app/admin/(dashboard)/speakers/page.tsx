import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { SpeakerFormDialog } from '@/components/admin/speaker-form-dialog'
import { SpeakersTable } from '@/components/admin/speakers-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'
import type { SpeakerWithTranslations } from '@/types/database'

export default async function AdminSpeakersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: speakers, error } = await supabase
    .from('speakers')
    .select('*, speaker_translations(*)')
    .order('sort_order', { ascending: true })

  const speakerList = (speakers ?? []) as SpeakerWithTranslations[]
  const nextSortOrder =
    speakerList.length > 0 ? Math.max(...speakerList.map((speaker) => speaker.sort_order)) + 1 : 0

  return (
    <>
      <AdminHeader
        title="Speakers"
        description="Manage keynote and invited speakers"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>All speakers</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load speakers. Check your Supabase connection.'
                  : `${speakerList.length} speaker(s) in the database`}
              </CardDescription>
            </div>
            <SpeakerFormDialog defaultSortOrder={nextSortOrder} />
          </CardHeader>
          <CardContent>
            {speakerList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <User className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No speakers yet. Add your first speaker.</p>
              </div>
            ) : (
              <SpeakersTable speakers={speakerList} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
