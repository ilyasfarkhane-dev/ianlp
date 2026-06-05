import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { TopicFormDialog } from '@/components/admin/topic-form-dialog'
import { TopicsTable } from '@/components/admin/topics-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tags } from 'lucide-react'
import type { TopicWithTranslations } from '@/types/database'

export default async function AdminTopicsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: topics, error } = await supabase
    .from('topics')
    .select('*, topic_translations(*)')
    .order('sort_order', { ascending: true })

  const topicList = (topics ?? []) as TopicWithTranslations[]

  return (
    <>
      <AdminHeader
        title="Topics"
        description="Manage main thematic areas and special focus cards"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Main Thematic Areas</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load topics. Check your Supabase connection.'
                  : `${topicList.length} topic(s) in the database`}
              </CardDescription>
            </div>
            <TopicFormDialog />
          </CardHeader>
          <CardContent>
            {topicList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <Tags className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No topics yet. Add your first thematic area.</p>
              </div>
            ) : (
              <TopicsTable topics={topicList} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
