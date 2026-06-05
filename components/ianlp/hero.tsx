'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import Countdown from './countdown'

const EASYCHAIR_SUBMIT_URL =
  'https://easychair.org/conferences/?conf=ianlp2026'

export default function Hero() {
  const t = useTranslations('hero')
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative flex min-h-screen flex-col bg-navy text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#0d2040]" />
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="relative flex flex-1 items-center pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={contentRef}
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              {t('badge')}
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
              {t('subtitle')}
            </h1>

            <div className="mb-8 space-y-2">
              <p className="text-lg font-medium text-white/90 sm:text-xl">{t('datesValue')}</p>
              <p className="text-base text-white/60">
                {t('venueValue')}, {t('venueSub')}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={EASYCHAIR_SUBMIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {t('callForPapers')}
              </a>
              <a href="#dates" className="btn-outline-light">
                {t('importantDates')}
              </a>
            </div>
          </div>

          <div className="lg:pt-4">
            <Countdown variant="hero" />
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
