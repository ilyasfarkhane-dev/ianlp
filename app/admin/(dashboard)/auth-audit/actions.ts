'use server'

import { logAdminAction } from '@/lib/admin/audit-log'

export async function recordAdminLogin() {
  await logAdminAction({
    action: 'login',
    resource: 'auth',
    resourceLabel: 'Admin sign in',
  })
  return { success: true }
}

export async function recordAdminLogout() {
  await logAdminAction({
    action: 'logout',
    resource: 'auth',
    resourceLabel: 'Admin sign out',
  })
  return { success: true }
}
