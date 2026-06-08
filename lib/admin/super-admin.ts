export const SUPER_ADMIN_EMAIL = 'idevo4281@gmail.com'

export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
}
