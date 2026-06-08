import type { CommitteeMemberWithTranslations, CommitteeType } from '@/types/database'

const COMMITTEE_TYPE_ORDER: CommitteeType[] = ['pc_chair', 'reviewer', 'organizing']

export function getCommitteeMembersByType(
  members: CommitteeMemberWithTranslations[],
  committeeType: CommitteeType
) {
  return members
    .filter((member) => member.committee_type === committeeType)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export function getFlattenedCommitteeOrder(members: CommitteeMemberWithTranslations[]) {
  return COMMITTEE_TYPE_ORDER.flatMap((committeeType) =>
    getCommitteeMembersByType(members, committeeType).map((member) => member.id)
  )
}

export function getNextSortOrderForType(
  members: CommitteeMemberWithTranslations[],
  committeeType: CommitteeType
) {
  const sectionMembers = getCommitteeMembersByType(members, committeeType)

  if (sectionMembers.length === 0) {
    if (committeeType === 'pc_chair') return 0
    if (committeeType === 'reviewer') {
      return getCommitteeMembersByType(members, 'pc_chair').length
    }
    return (
      getCommitteeMembersByType(members, 'pc_chair').length +
      getCommitteeMembersByType(members, 'reviewer').length
    )
  }

  return Math.max(...sectionMembers.map((member) => member.sort_order)) + 1
}
