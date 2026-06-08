'use client'

import { useEffect } from 'react'
import { recordAdminLogin } from '@/app/admin/(dashboard)/auth-audit/actions'

const LOGIN_AUDIT_KEY = 'ianlp-pending-login-audit'

export function markPendingLoginAudit() {
  sessionStorage.setItem(LOGIN_AUDIT_KEY, '1')
}

export function LoginAuditRecorder() {
  useEffect(() => {
    if (sessionStorage.getItem(LOGIN_AUDIT_KEY) !== '1') return

    sessionStorage.removeItem(LOGIN_AUDIT_KEY)
    void recordAdminLogin().catch(() => {
      // Audit logging is best-effort.
    })
  }, [])

  return null
}
