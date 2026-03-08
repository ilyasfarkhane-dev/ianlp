'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const submissionCards = [
  { titleKey: 'platform', descKey: 'platformDesc', itemKeys: ['platform1', 'platform2', 'platform3'] },
  { titleKey: 'format', descKey: 'formatDesc', itemKeys: ['format1', 'format2', 'format3'] },
  { titleKey: 'keyReqs', descKey: 'keyReqsDesc', itemKeys: ['keyReqs1', 'keyReqs2', 'keyReqs3'] },
]

export default function Submission() {
  const t = useTranslations('submission')
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set([headingRef.current, ...cardsRef.current.filter((c) => c !== null)], {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
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

      gsap.fromTo(
        cardsRef.current.filter((c) => c !== null),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 65%',
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
      id="submission"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {submissionCards.map((card, idx) => (
            <div
              key={card.titleKey}
              ref={(el) => {
                cardsRef.current[idx] = el
              }}
            >
              <Card className="p-6 h-full rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors">
                <Badge className="mb-3">{t(card.descKey)}</Badge>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t(card.titleKey)}
                </h3>
                <ul className="space-y-2">
                  {card.itemKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        <Card
          ref={(el) => {
            cardsRef.current[3] = el
          }}
          className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6">
            {t('qualityEthics')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="font-semibold text-primary mb-3">{t('evaluationCriteria')}</p>
              <ul className="space-y-2 text-muted-foreground">
                {['eval1', 'eval2', 'eval3', 'eval4', 'eval5'].map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-accent mb-3">{t('plagiarism')}</p>
              <ul className="space-y-2 text-muted-foreground">
                {['plag1', 'plag2', 'plag3', 'plag4', 'plag5'].map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
