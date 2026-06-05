'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type NavigationScope = 'admin' | 'site'

type NavigationProgressProps = {
  scope: NavigationScope
}

function matchesScope(href: string, scope: NavigationScope): boolean {
  if (scope === 'admin') {
    return href.startsWith('/admin')
  }
  return /^\/(en|fr|ar)(\/|$)/.test(href)
}

export function NavigationProgress({ scope }: NavigationProgressProps) {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(false)
  }, [pathname])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement).closest('a[href]')
      if (!anchor || anchor.target === '_blank') return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
      }

      const url = new URL(href, window.location.origin)
      if (url.origin !== window.location.origin) return

      const nextPath = `${url.pathname}${url.search}`
      if (nextPath === pathname) return
      if (!matchesScope(nextPath, scope)) return

      setPending(true)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname, scope])

  if (!pending) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-primary/15 motion-reduce:opacity-80"
      aria-hidden
    >
      <div className="navigation-progress-bar h-full w-1/3 bg-primary" />
    </div>
  )
}
