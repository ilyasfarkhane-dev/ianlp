'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { MapPin, Plane, Hotel, Info } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function VenueTravel() {
  const t = useTranslations('venue')
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
      id="venue"
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

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Venue Card */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el
            }}
          >
            <Card className="p-8 h-full rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{t('venue')}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {t('hostInstitution')}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {t('fsbm')}
                  </p>
                  <p className="text-foreground/80 mt-1">
                    {t('h2c')}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {t('address')}
                  </p>
                  <p className="text-foreground">
                    {t('addressValue')}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {t('aboutCasablanca')}
                  </p>
                  <p className="text-foreground/80">
                    {t('aboutCasablancaDesc')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Travel Info */}
          <div className="space-y-6">
            <div
              ref={(el) => {
                cardsRef.current[1] = el
              }}
            >
              <Card className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <Plane size={20} />
                  </div>
                  <h4 className="font-bold text-foreground">{t('gettingThere')}</h4>
                </div>
                <p className="text-foreground/80 text-sm">
                  {t('gettingThereDesc')}
                </p>
              </Card>
            </div>

            <div
              ref={(el) => {
                cardsRef.current[2] = el
              }}
            >
              <Card className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <Hotel size={20} />
                  </div>
                  <h4 className="font-bold text-foreground">{t('accommodation')}</h4>
                </div>
                <p className="text-foreground/80 text-sm">
                  {t('accommodationDesc')}
                </p>
              </Card>
            </div>

            <div
              ref={(el) => {
                cardsRef.current[3] = el
              }}
            >
              <Card className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  <h4 className="font-bold text-foreground">{t('moreInfo')}</h4>
                </div>
                <p className="text-foreground/80 text-sm">
                  {t('moreInfoDesc')}
                </p>
              </Card>
            </div>
          </div>
        </div>

        <Card className="p-8 border border-border/50 bg-gradient-to-br from-primary to-accent/5 overflow-hidden">
          <p className="text-lg font-semibold text-foreground mb-4">
            {t('mapTitle')}
          </p>
          <div className="relative w-full rounded-lg overflow-hidden border border-border/50" style={{ aspectRatio: '16/10', minHeight: '384px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.4905454412437!2d-7.544054523992428!3d33.56661057334374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda633261bbe100f%3A0xe48b03dd8c6794a0!2sFacult%C3%A9%20des%20Sciences%20Ben%20M%E2%80%99Sick!5e0!3m2!1sfr!2sma!4v1772934740958!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', inset: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapTitle')}
            />
          </div>
        </Card>
      </div>
    </section>
  )
}
