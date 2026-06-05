'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { PublicPricingTier } from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

type PricingProps = {
  tiers: PublicPricingTier[]
}

export default function Pricing({ tiers }: PricingProps) {
  const t = useTranslations('pricing')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const handleRegister = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
          }
        )
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="border-t border-primary/10 bg-primary/[0.06] px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mx-auto mb-12 max-w-2xl text-center lg:mb-14">
          <p className="section-label">{t('label')}</p>
          <h2 className="section-heading">{t('title')}</h2>
          <p className="section-subheading">{t('subtitle')}</p>
          <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
        </div>

        <div
          ref={cardsRef}
          className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:max-w-4xl sm:grid-cols-2 sm:gap-5 lg:gap-6"
        >
          {tiers.map((tier) => (
            <article
              key={tier.id}
              className={cn(
                'registration-card relative flex flex-col bg-white px-6 pb-6 pt-8 text-center shadow-[0_4px_24px_rgba(37,99,235,0.1)] sm:px-7 sm:pb-7',
                tier.isFeatured && 'sm:pt-10'
              )}
            >
              {tier.isFeatured ? (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
                  {t('bestPlanBadge')}
                </span>
              ) : null}

              <h3 className="text-base font-bold uppercase tracking-[0.12em] text-foreground sm:text-lg">
                {tier.name}
              </h3>

              <div className="mt-5 flex items-baseline justify-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{tier.currency}</span>
                <span className="text-4xl font-bold leading-none text-primary sm:text-5xl">
                  {tier.price}
                </span>
              </div>

              <div className="my-6 border-t border-border" aria-hidden />

              <ul className="mb-8 flex flex-1 flex-col gap-2.5 text-left sm:mx-auto sm:max-w-[17rem]">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm leading-snug text-foreground">
                    <span className="flex-shrink-0 text-muted-foreground" aria-hidden>
                      –
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleRegister}
                className="mt-auto w-full min-h-11 cursor-pointer rounded-full border-2 border-primary/25 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {t('registerNow')}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
