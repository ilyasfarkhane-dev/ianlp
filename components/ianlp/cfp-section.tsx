'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const cfpSections = [
  { titleKey: 'publication', itemKeys: ['pub1', 'pub2', 'pub3'] },
  { titleKey: 'requirements', itemKeys: ['req1', 'req2', 'req3', 'req4'] },
]

export default function CFPSection() {
  const t = useTranslations('cfp')
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set([contentRef.current, ...cardsRef.current.filter((c) => c !== null)], {
        opacity: 1,
        y: 0,
      })
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
      id="cfp"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={contentRef}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
            {t('intro')}
          </p>
          <a
            href="#submission"
            className="btn-gradient inline-flex items-center justify-center px-8 py-3 text-white font-semibold rounded-lg transition-all shadow-lg"
          >
            {t('submitResearch')}
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {cfpSections.map((section, idx) => (
            <div
              key={section.titleKey}
              ref={(el) => {
                cardsRef.current[idx] = el
              }}
            >
              <Card className="p-8 h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  {t(section.titleKey)}
                </h3>
                <ul className="space-y-3">
                  {section.itemKeys.map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-3 text-foreground/80"
                    >
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-muted-foreground mb-4">{t('readyToSubmit')}</p>
          <Button
            disabled
            size="lg"
            className="btn-gradient text-white border-0"
            title={t('submitEasyChair')}
          >
            {t('submitEasyChair')}
          </Button>
        </div>
      </div>
    </section>
  )
}
