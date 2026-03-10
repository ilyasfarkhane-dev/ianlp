'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const REVIEWER_COUNT = 12

export default function Committees() {
  const t = useTranslations('committees')
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
          stagger: 0.08,
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
      id="committees"
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

        <div className="mb-16 p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t('pcChairs')}
          </h3>
          <p className="text-muted-foreground mb-6">{t('pcChairsSub')}</p>
          <div className="grid sm:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="font-bold text-foreground">{t('pcChair1')}</p>
              <p className="text-sm text-muted-foreground">{t('pcChair1Aff')}</p>
            </div>
            <div>
              <p className="font-bold text-foreground">{t('pcChair2')}</p>
              <p className="text-sm text-muted-foreground">{t('pcChair2Aff')}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('pcChairsOthers')}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-foreground mb-8">
            {t('externalReviewers')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: REVIEWER_COUNT }, (_, i) => i + 1).map((i, index) => {
              const name = t(`reviewer${i}Name`)
              return (
                <div
                  key={`reviewer-${i}`}
                  ref={(el) => {
                    cardsRef.current[index] = el
                  }}
                >
                  <Card className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold">
                        {name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
                      <Globe className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {t(`reviewer${i}Aff`)}
                      </p>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

      

        <div className="mt-16 p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            {t('organizingCommittee')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-primary mb-2">{t('generalChair')}</p>
              <p className="text-foreground font-semibold">{t('profOmar')}</p>
              <p className="text-sm text-muted-foreground">
                {t('fsbmH2c')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Email:{' '}
                <a
                  href="mailto:omar.zahour@univh2c.ma"
                  className="text-primary hover:underline"
                >
                  omar.zahour@univh2c.ma
                </a>
              </p>
            </div>
            <div>
              <p className="font-bold text-accent mb-2">{t('organizingInstitution')}</p>
              <p className="text-foreground font-semibold">{t('am2iFsbm')}</p>
              <p className="text-sm text-muted-foreground">
                {t('h2cAddress')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
