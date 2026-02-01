'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const t = useTranslations('hero')
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set([titleRef.current, subtitleRef.current, descRef.current, cardRef.current], {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.timeline().fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' },
          '-=0.4'
        )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center"
    >
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-semibold text-primary">
                {t('badge')}
              </span>
            </div>

            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
            >
              {t('title')}
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-muted-foreground mb-6 font-semibold"
            >
              {t('subtitle')}
            </p>

            <p
              ref={descRef}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl"
            >
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#cfp"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#002bb8] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:shadow-primary/20"
              >
                {t('callForPapers')} <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
              </a>
              <a
                href="#dates"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                {t('importantDates')}
              </a>
            </div>
          </div>

          {/* Conference Snapshot Card */}
          <div ref={cardRef} className="relative">
            <Card className="p-8 bg-card border border-border/50 shadow-xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {t('eventDetails')}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {t('conferenceSnapshot')}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">📅</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {t('dates')}
                      </p>
                      <p className="text-foreground font-semibold">
                        {t('datesValue')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-bold">📍</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {t('venue')}
                      </p>
                      <p className="text-foreground font-semibold">
                        {t('venueValue')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('venueSub')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-bold">📚</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {t('publication')}
                      </p>
                      <p className="text-foreground font-semibold">
                        {t('publicationValue')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('publicationSub')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground italic">
                    {t('quote')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Decorative gradient blur */}
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
