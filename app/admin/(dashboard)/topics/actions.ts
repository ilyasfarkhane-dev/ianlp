'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { finalizeAction } from '@/lib/admin/audit-log'
import { revalidatePublicSite } from '@/lib/revalidate-public'
import type { FocusIcon, Locale, TopicType } from '@/types/database'

type TranslationInput = {
  locale: Locale
  title: string
  description: string
}

export async function createTopic(input: {
  sort_order: number
  topic_type: TopicType
  icon: FocusIcon | null
  is_published: boolean
  translations: TranslationInput[]
}) {
  const supabase = await createClient()

  const { data: topic, error } = await supabase
    .from('topics')
    .insert({
      sort_order: input.sort_order,
      topic_type: input.topic_type,
      icon: input.topic_type === 'focus' ? input.icon : null,
      is_published: input.is_published,
    })
    .select('id')
    .single()

  if (error || !topic) {
    return { error: error?.message ?? 'Failed to create topic' }
  }

  const { error: translationError } = await supabase.from('topic_translations').insert(
    input.translations.map((t) => ({
      topic_id: topic.id,
      locale: t.locale,
      title: t.title,
      description: t.description,
    }))
  )

  if (translationError) {
    return { error: translationError.message }
  }

  revalidatePath('/admin/topics')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    {
      action: 'create',
      resource: 'topic',
      resourceId: topic.id,
      resourceLabel: input.translations.find((t) => t.locale === 'en')?.title,
    }
  )
}

export async function updateTopic(
  id: string,
  input: {
    topic_type: TopicType
    icon: FocusIcon | null
    is_published: boolean
    translations: TranslationInput[]
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('topics')
    .update({
      topic_type: input.topic_type,
      icon: input.topic_type === 'focus' ? input.icon : null,
      is_published: input.is_published,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  for (const t of input.translations) {
    const { error: upsertError } = await supabase.from('topic_translations').upsert(
      {
        topic_id: id,
        locale: t.locale,
        title: t.title,
        description: t.description,
      },
      { onConflict: 'topic_id,locale' }
    )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/admin/topics')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    {
      action: 'update',
      resource: 'topic',
      resourceId: id,
      resourceLabel: input.translations.find((t) => t.locale === 'en')?.title,
    }
  )
}

export async function deleteTopic(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('topics').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/topics')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction({ success: true }, { action: 'delete', resource: 'topic', resourceId: id })
}

export async function reorderTopicsByType(topicType: TopicType, orderedIds: string[]) {
  const supabase = await createClient()

  const { data: allTopics, error: fetchError } = await supabase
    .from('topics')
    .select('id, topic_type, sort_order')
    .order('sort_order', { ascending: true })

  if (fetchError) {
    return { error: fetchError.message }
  }

  const topics = allTopics ?? []
  const byType: Record<TopicType, string[]> = {
    main: topics
      .filter((topic) => topic.topic_type === 'main')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((topic) => topic.id),
    focus: topics
      .filter((topic) => topic.topic_type === 'focus')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((topic) => topic.id),
  }

  byType[topicType] = orderedIds

  const flattened = [...byType.main, ...byType.focus]

  for (let index = 0; index < flattened.length; index++) {
    const { error } = await supabase
      .from('topics')
      .update({ sort_order: index })
      .eq('id', flattened[index])

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/topics')
  revalidatePath('/admin')
  revalidatePublicSite()
  return finalizeAction(
    { success: true },
    {
      action: 'update',
      resource: 'topic',
      resourceLabel: `${topicType === 'main' ? 'Main topic' : 'Focus topic'} order`,
    }
  )
}
