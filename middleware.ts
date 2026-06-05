import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    return updateSession(request)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/(en|fr|ar)/:path*', '/admin', '/admin/:path*'],
}
