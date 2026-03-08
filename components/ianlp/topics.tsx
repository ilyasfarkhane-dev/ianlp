'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'

gsap.registerPlugin(ScrollTrigger)

const topicKeys = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6', 'topic7', 'topic8', 'topic9', 'topic10', 'topic11', 'topic12', 'topic13', 'topic14', 'topic15', 'topic16', 'topic17', 'topic18']

export default function Topics() {
  const t = useTranslations('topics')
  const containerRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(badgesRef.current.filter((b) => b !== null), {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgesRef.current.filter((b) => b !== null),
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
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
      id="topics"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {topicKeys.map((key, index) => (
            <div
              key={key}
              ref={(el) => {
                badgesRef.current[index] = el
              }}
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium rounded-lg border-white/20 hover:bg-primary/60 hover:border-primary/50 hover:text-white transition-colors cursor-default"
              >
                {t(key)}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-4">
            {t('specialFocus')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-primary mb-2">{t('coreNlp')}</p>
              <p className="text-muted-foreground text-sm">{t('coreNlpDesc')}</p>
            </div>
            <div>
              <p className="font-semibold text-accent mb-2">{t('advancedModels')}</p>
              <p className="text-muted-foreground text-sm">{t('advancedModelsDesc')}</p>
            </div>
            <div>
              <p className="font-semibold text-secondary mb-2">{t('trustworthyAi')}</p>
              <p className="text-muted-foreground text-sm">{t('trustworthyAiDesc')}</p>
            </div>
            <div>
              <p className="font-semibold text-primary mb-2">{t('realWorldApps')}</p>
              <p className="text-muted-foreground text-sm">{t('realWorldAppsDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
