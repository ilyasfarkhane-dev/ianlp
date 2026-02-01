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
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
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
            <Card className="p-8 h-full border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-[#002bb8] text-white flex items-center justify-center">
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
              <Card className="p-6 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
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
              <Card className="p-6 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
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
              <Card className="p-6 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
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

        <Card className="p-8 border border-border/50 bg-[#002bb8]/5 overflow-hidden">
          <div className="relative bg-muted rounded-lg overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <p className="text-lg font-semibold text-foreground mb-2">
                {t('mapTitle')}
              </p>
              <p className="text-muted-foreground text-sm max-w-md">
                {t('mapDesc')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
