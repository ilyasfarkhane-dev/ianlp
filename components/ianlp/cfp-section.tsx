'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const EASYCHAIR_SUBMIT_URL =
  'https://easychair.org/conferences/?conf=ianlp2026'

const cfpSections: { titleKey: string; itemKeys: string[]; icon: LucideIcon }[] = [
  { titleKey: 'publication', itemKeys: ['pub1', 'pub2', 'pub3'], icon: BookOpen },
  { titleKey: 'requirements', itemKeys: ['req1', 'req2', 'req3', 'req4'], icon: ClipboardCheck },
]

export default function CFPSection() {
  const t = useTranslations('cfp')
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
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
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' },
          }
        )
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="cfp" className="section-light border-y border-border bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div ref={introRef}>
            <p className="section-label">{t('label')}</p>
            <h2 className="section-heading">{t('title')}</h2>
            <p className="section-subheading mb-8 max-w-md">{t('intro')}</p>

            <a
              href={EASYCHAIR_SUBMIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              {t('submitResearch')}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>

          <div ref={cardsRef} className="space-y-4">
            {cfpSections.map((section) => {
              const Icon = section.icon
              return (
                <article
                  key={section.titleKey}
                  className="group rounded-xl bg-slate-50/70 p-6 transition-colors duration-200 hover:bg-slate-50 sm:p-7"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">
                      {t(section.titleKey)}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {section.itemKeys.map((key) => (
                      <li
                        key={key}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
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

        <div
          ref={ctaRef}
          className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary px-6 py-8 sm:flex-row sm:items-center sm:px-10 sm:py-9"
        >
          <div>
            <p className="text-lg font-bold text-primary-foreground">{t('readyToSubmit')}</p>
          </div>

          <a
            href={EASYCHAIR_SUBMIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t('submitEasyChair')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
