'use server'

import { createClient } from '@/lib/supabase/server'
import type { AdminActionLogInput } from '@/lib/admin/audit-log-types'

export type { AdminActionLogInput, AdminActionType, AdminResourceType } from '@/lib/admin/audit-log-types'

export async function logAdminAction(input: AdminActionLogInput): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return

  await supabase.from('admin_action_logs').insert({
    user_email: user.email,
    action: input.action,
    resource: input.resource,
    resource_id: input.resourceId ?? null,
    resource_label: input.resourceLabel ?? null,
    metadata: input.metadata ?? {},
  })
}

export async function finalizeAction<T extends { success?: boolean }>(
  result: T,
  audit?: AdminActionLogInput
): Promise<T> {
  if (result.success && audit) {
    await logAdminAction(audit)
  }
  return result
}
