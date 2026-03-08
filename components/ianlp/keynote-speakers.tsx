'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'

gsap.registerPlugin(ScrollTrigger)

const keynoteTopicKeys = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6']

export default function KeynoteSpeakers() {
  const t = useTranslations('keynote')
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(contentRef.current, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={contentRef}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {keynoteTopicKeys.map((key) => (
            <div
              key={key}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <p className="font-semibold text-foreground">{t(key)}</p>
              </div>
            </div>
          ))}
        </div>

        <Card className="p-12 text-center rounded-xl border border-white/10 bg-primary/5 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
              <span className="text-2xl">🎤</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {t('comingSoon')}
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('comingSoonDesc')}
            </p>
           
          </div>
        </Card>
      </div>
    </section>
  )
}
