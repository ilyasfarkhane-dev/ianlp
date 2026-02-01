'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

gsap.registerPlugin(ScrollTrigger)

export default function ReviewProcess() {
  const t = useTranslations('review')
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
      id="review"
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border/50 rounded-lg">
              <h3 className="font-bold text-lg text-foreground mb-4">{t('keyPrinciples')}</h3>
              <ul className="space-y-3">
                {['principle1', 'principle2', 'principle3', 'principle4', 'principle5'].map((key) => (
                  <li key={key} className="flex gap-3 text-foreground">
                    <span className="text-primary font-bold">✓</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[#002bb8]/10 border border-[#002bb8]/20 rounded-lg">
              <h3 className="font-bold text-lg text-foreground mb-4">
                {t('evaluationCriteria')}
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                {['crit1', 'crit2', 'crit3', 'crit4', 'crit5'].map((key, i) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-[#002bb8] font-semibold">{i + 1}.</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                {t('accordion1Title')}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>{t('accordion1Desc')}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>{t('accordion1a')}</li>
                  <li>{t('accordion1b')}</li>
                  <li>{t('accordion1c')}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                {t('accordion2Title')}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>{t('accordion2Desc')}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>{t('accordion2a')}</li>
                  <li>{t('accordion2b')}</li>
                  <li>{t('accordion2c')}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                {t('accordion3Title')}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>{t('accordion3Desc')}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>{t('accordion3a')}</li>
                  <li>{t('accordion3b')}</li>
                  <li>{t('accordion3c')}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                {t('accordion4Title')}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>{t('accordion4Desc')}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>{t('accordion4a')}</li>
                  <li>{t('accordion4b')}</li>
                  <li>{t('accordion4c')}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                {t('accordion5Title')}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>{t('accordion5Desc')}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>{t('accordion5a')}</li>
                  <li>{t('accordion5b')}</li>
                  <li>{t('accordion5c')}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
