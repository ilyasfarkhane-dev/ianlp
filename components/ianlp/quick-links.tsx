'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { ArrowRight, Calendar, FileText, Send, Users, type LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type QuickLink = {
  icon: LucideIcon
  labelKey: string
  descKey: string
  href: string
}

const links: QuickLink[] = [
  { icon: FileText, labelKey: 'callForPapers', descKey: 'callForPapersDesc', href: '#cfp' },
  { icon: Calendar, labelKey: 'importantDates', descKey: 'importantDatesDesc', href: '#dates' },
  { icon: Send, labelKey: 'submitPaper', descKey: 'submitPaperDesc', href: '#submission' },
  { icon: Users, labelKey: 'committees', descKey: 'committeesDesc', href: '#committees' },
]

export default function QuickLinks() {
  const t = useTranslations('quickLinks')
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  const handleClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

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
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
          }
        )
      }

      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: linksRef.current, start: 'top 85%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="border-y border-border bg-muted/30 px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div ref={introRef}>
            <p className="section-label">{t('label')}</p>
            <h2 className="section-heading">{t('title')}</h2>
            <p className="section-subheading mb-6 max-w-md">{t('subtitle')}</p>
            <div className="h-1 w-12 rounded-full bg-primary" aria-hidden />
          </div>

          <div ref={linksRef} className="divide-y divide-border">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleClick(link.href)}
                  className="group flex w-full cursor-pointer items-start gap-5 py-6 text-left transition-colors duration-200 first:pt-0 last:pb-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground">{t(link.labelKey)}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {t(link.descKey)}
                    </p>
                  </div>

                  <ArrowRight
                    className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
