'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import {
  BrainCircuit,
  Building2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const topicKeys = [
  'topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6',
  'topic7', 'topic8', 'topic9', 'topic10', 'topic11', 'topic12',
]

const focusAreas: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: 'coreNlp', desc: 'coreNlpDesc', icon: BrainCircuit },
  { title: 'advancedModels', desc: 'advancedModelsDesc', icon: Sparkles },
  { title: 'trustworthyAi', desc: 'trustworthyAiDesc', icon: ShieldCheck },
  { title: 'realWorldApps', desc: 'realWorldAppsDesc', icon: Building2 },
]

export default function Topics() {
  const t = useTranslations('topics')
  const containerRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<HTMLDivElement>(null)
  const focusCardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 75%' },
        }
      )

      if (focusRef.current) {
        gsap.fromTo(
          focusRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: focusRef.current, start: 'top 85%' },
          }
        )
      }

      if (focusCardsRef.current) {
        gsap.fromTo(
          focusCardsRef.current.children,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: focusCardsRef.current, start: 'top 88%' },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} id="topics" className="section-light bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="section-label">{t('label')}</p>
          <h2 className="section-heading">{t('title')}</h2>
          <p className="section-subheading mx-auto">{t('subtitle')}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-14">
          {topicKeys.map((key) => (
            <Badge
              key={key}
              variant="outline"
              className="px-4 py-2 text-sm font-medium rounded-full border-border bg-white hover:bg-primary hover:border-primary hover:text-white transition-colors duration-200 cursor-default"
            >
              {t(key)}
            </Badge>
          ))}
        </div>

        <div ref={focusRef} className="relative overflow-hidden bg-white">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
            <div className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:w-[min(100%,340px)] lg:flex-shrink-0 lg:px-10 lg:py-10">
              <p className="section-label mb-3 text-primary">{t('label')}</p>
              <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {t('specialFocus')}
              </h3>
              <div className="mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {t('specialFocusDesc')}
              </p>
            </div>

            <div
              ref={focusCardsRef}
              className="grid flex-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:p-8"
            >
              {focusAreas.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={item.title}
                    className="group flex h-full flex-col rounded-xl bg-slate-50/60 p-5 transition-colors duration-200 hover:bg-slate-50"
                  >
                    <div className="mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h4 className="font-bold text-foreground">{t(item.title)}</h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {t(item.desc)}
                    </p>
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
