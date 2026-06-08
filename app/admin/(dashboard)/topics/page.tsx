import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { TopicsBoard } from '@/components/admin/topics-table'
import { getNextSortOrderForType } from '@/lib/admin/topics'
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
  const defaultSortOrders = {
    main: getNextSortOrderForType(topicList, 'main'),
    focus: getNextSortOrderForType(topicList, 'focus'),
  }

  return (
    <>
      <AdminHeader
        title="Topics"
        description="Manage main thematic areas and special focus cards"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {error ? (
          <p className="text-sm text-destructive">
            Could not load topics. Check your Supabase connection.
          </p>
        ) : null}

        <TopicsBoard topics={topicList} defaultSortOrders={defaultSortOrders} />
      </main>
    </>
  )
}
