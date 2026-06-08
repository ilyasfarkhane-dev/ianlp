export type AdminActionType = 'create' | 'update' | 'delete' | 'login' | 'logout'

export type AdminResourceType =
  | 'speaker'
  | 'important_date'
  | 'topic'
  | 'committee_member'
  | 'pricing_tier'
  | 'partner'
  | 'workshop'
  | 'site_settings'
  | 'auth'

export type AdminActionLogInput = {
  action: AdminActionType
  resource: AdminResourceType
  resourceId?: string | null
  resourceLabel?: string | null
  metadata?: Record<string, unknown>
}

export const ADMIN_ACTION_LABELS: Record<AdminActionType, string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  login: 'Signed in',
  logout: 'Signed out',
}

export const ADMIN_RESOURCE_LABELS: Record<AdminResourceType, string> = {
  speaker: 'Speaker',
  important_date: 'Important Date',
  topic: 'Topic',
  committee_member: 'Committee Member',
  pricing_tier: 'Pricing Tier',
  partner: 'Partner',
  workshop: 'Workshop',
  site_settings: 'Site Settings',
  auth: 'Authentication',
}
