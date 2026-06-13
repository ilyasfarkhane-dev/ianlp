'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import type { PublicRegisterPageContent } from '@/types/database'

const sections = [
  { id: 'conference-fees', labelKey: 'jumpToFees' as const },
] as const

type RegisterPageHeroProps = {
  pageContent: PublicRegisterPageContent
}

export default function RegisterPageHero({ pageContent }: RegisterPageHeroProps) {
  const t = useTranslations('register')
  const tHero = useTranslations('hero')
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-navy text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#0d2040]" />
        <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <Link
          href="/ianlp"
          className="group mb-10 inline-flex cursor-pointer items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden
          />
          {t('backToConference')}
        </Link>

        <div
          ref={contentRef}
          className="grid gap-12 pb-16 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-16 lg:pb-20"
        >
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              {t('label')}
            </p>

            <h1 className="text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-[2.65rem]">
              {pageContent.pageTitle}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              {pageContent.pageSubtitle}
            </p>

            <div className="mt-8 space-y-1.5 border-l-2 border-secondary/80 pl-5">
              <p className="text-lg font-medium text-white/90">{pageContent.datesValue}</p>
              <p className="text-base text-white/60">
                {tHero('venueValue')}, {tHero('venueSub')}
              </p>
              <p className="pt-1 text-sm text-orange-200/90">{pageContent.limitedSpots}</p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo('conference-fees')}
                className="btn-primary"
              >
                {t('jumpToFees')}
              </button>
              <Link href="/ianlp#workshops" className="btn-outline-light">
                {t('jumpToWorkshops')}
              </Link>
            </div>
          </div>

          <nav
            aria-label={t('onThisPage')}
            className="border-t border-white/10 pt-8 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-2"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              {t('onThisPage')}
            </p>
            <ul className="mt-4 space-y-1">
              {sections.map(({ id, labelKey }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    className="block w-full cursor-pointer py-2.5 text-left text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    {t(labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
