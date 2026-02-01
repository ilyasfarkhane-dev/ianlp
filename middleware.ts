import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Only run middleware for locale-prefixed paths so / is handled by app/page.tsx
  matcher: ['/(en|fr|ar)/:path*'],
}
