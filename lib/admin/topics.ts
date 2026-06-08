import type { TopicType, TopicWithTranslations } from '@/types/database'

const TOPIC_TYPE_ORDER: TopicType[] = ['main', 'focus']

export function getTopicsByType(topics: TopicWithTranslations[], topicType: TopicType) {
  return topics
    .filter((topic) => topic.topic_type === topicType)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export function getFlattenedTopicOrder(topics: TopicWithTranslations[]) {
  return TOPIC_TYPE_ORDER.flatMap((topicType) =>
    getTopicsByType(topics, topicType).map((topic) => topic.id)
  )
}

export function getNextSortOrderForType(topics: TopicWithTranslations[], topicType: TopicType) {
  const sectionTopics = getTopicsByType(topics, topicType)

  if (sectionTopics.length === 0) {
    if (topicType === 'main') return 0
    return getTopicsByType(topics, 'main').length
  }

  return Math.max(...sectionTopics.map((topic) => topic.sort_order)) + 1
}
