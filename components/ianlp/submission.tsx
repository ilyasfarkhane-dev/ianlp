'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import {
  CheckCircle2,
  FileText,
  ListChecks,
  MonitorUp,
  Scale,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const submissionCards: {
  titleKey: string
  descKey: string
  itemKeys: string[]
  icon: LucideIcon
}[] = [
  {
    titleKey: 'platform',
    descKey: 'platformDesc',
    itemKeys: ['platform2', 'platform3'],
    icon: MonitorUp,
  },
  {
    titleKey: 'format',
    descKey: 'formatDesc',
    itemKeys: ['format1', 'format2', 'format3'],
    icon: FileText,
  },
  {
    titleKey: 'keyReqs',
    descKey: 'keyReqsDesc',
    itemKeys: ['keyReqs1', 'keyReqs2', 'keyReqs3'],
    icon: ListChecks,
  },
]

const ethicsSections: { titleKey: string; itemKeys: string[]; icon: LucideIcon }[] = [
  { titleKey: 'evaluationCriteria', itemKeys: ['eval1', 'eval2', 'eval3', 'eval4', 'eval5'], icon: Scale },
  { titleKey: 'plagiarism', itemKeys: ['plag1', 'plag2', 'plag3', 'plag4', 'plag5'], icon: ShieldAlert },
]

export default function Submission() {
  const t = useTranslations('submission')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const qualityRef = useRef<HTMLDivElement>(null)
  const ethicsCardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
          }
        )
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 82%' },
          }
        )
      }

      if (qualityRef.current) {
        gsap.fromTo(
          qualityRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: qualityRef.current, start: 'top 85%' },
          }
        )
      }

      if (ethicsCardsRef.current) {
        gsap.fromTo(
          ethicsCardsRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: ethicsCardsRef.current, start: 'top 88%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="submission" className="section-light bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-14 text-center">
          <p className="section-label">{t('label')}</p>
          <h2 className="section-heading">{t('title')}</h2>
          <p className="section-subheading mx-auto max-w-2xl">{t('subtitle')}</p>
        </div>

        <div ref={cardsRef} className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {submissionCards.map((card) => {
            const Icon = card.icon
            return (
              <article
                key={card.titleKey}
                className="group flex h-full flex-col rounded-xl bg-white p-6 transition-colors duration-200 hover:bg-slate-50 sm:p-7"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {t(card.descKey)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground">{t(card.titleKey)}</h3>

                <ul className="mt-4 space-y-2.5">
                  {card.itemKeys.map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <div ref={qualityRef} className="relative overflow-hidden bg-white">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
            <div className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:w-[min(100%,340px)] lg:flex-shrink-0 lg:px-10 lg:py-10">
              <p className="section-label mb-3 text-primary">{t('label')}</p>
              <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {t('qualityEthics')}
              </h3>
              <div className="mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
            </div>

            <div
              ref={ethicsCardsRef}
              className="grid flex-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:p-8"
            >
              {ethicsSections.map((section) => {
                const Icon = section.icon
                return (
                  <article
                    key={section.titleKey}
                    className="group flex h-full flex-col rounded-xl bg-slate-50/60 p-5 transition-colors duration-200 hover:bg-slate-50"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4" aria-hidden />
                      </div>
                      <h4 className="font-bold text-foreground">{t(section.titleKey)}</h4>
                    </div>

                    <ul className="space-y-2.5">
                      {section.itemKeys.map((key) => (
                        <li
                          key={key}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                            aria-hidden
                          />
                          <span>{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
