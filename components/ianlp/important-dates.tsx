'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'

gsap.registerPlugin(ScrollTrigger)

const dateKeys = [
  { labelKey: 'paperDeadline', dateKey: 'paperDate', descKey: 'paperDesc' },
  { labelKey: 'notification', dateKey: 'notificationDate', descKey: 'notificationDesc' },
  { labelKey: 'cameraReady', dateKey: 'cameraReadyDate', descKey: 'cameraReadyDesc' },
  { labelKey: 'conferenceDates', dateKey: 'conferenceDate', descKey: 'conferenceDesc' },
]

export default function ImportantDates() {
  const t = useTranslations('dates')
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(timelineRef.current.filter((t) => t !== null), {
        opacity: 1,
        x: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineRef.current.filter((t) => t !== null),
        {
          opacity: 0,
          x: (index) => (index % 2 === 0 ? -30 : 30),
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="dates"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {dateKeys.map((item, index) => (
            <div
              key={item.labelKey}
              ref={(el) => {
                timelineRef.current[index] = el
              }}
            >
              <Card className="p-6 h-full rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {t(item.labelKey)}
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-2">
                      {t(item.dateKey)}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
