'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { CalendarRange, Download, Mic2, Presentation } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const PROGRAM_PDF_URL = '/programe.pdf'
const PROGRAM_PDF_FILENAME = 'IANLP-2026-Program.pdf'

const HIGHLIGHT_KEYS = ['highlight1', 'highlight2', 'highlight3'] as const

export default function ProgramSection() {
  const t = useTranslations('program')
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="program"
      className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={contentRef}
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm"
        >
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:p-10">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarRange className="h-5 w-5" aria-hidden />
                </div>
                <p className="section-label mb-0">{t('label')}</p>
              </div>

              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t('title')}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('subtitle')}
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {HIGHLIGHT_KEYS.map((key, index) => {
                  const icons = [Mic2, Presentation, CalendarRange]
                  const Icon = icons[index]

                  return (
                    <li
                      key={key}
                      className="flex items-start gap-3 rounded-xl bg-slate-50/70 px-4 py-3"
                    >
                      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                      <span className="text-sm leading-relaxed text-muted-foreground">{t(key)}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="flex flex-col items-stretch gap-3 lg:min-w-[240px]">
              <a
                href={PROGRAM_PDF_URL}
                download={PROGRAM_PDF_FILENAME}
                className="btn-primary inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <Download className="h-4 w-4" aria-hidden />
                {t('downloadButton')}
              </a>
              <p className="text-center text-xs text-muted-foreground">{t('downloadHint')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
