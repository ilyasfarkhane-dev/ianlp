'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Hotel, Info, MapPin, Plane, type LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const travelItems: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Plane, title: 'gettingThere', desc: 'gettingThereDesc' },
  { icon: Hotel, title: 'accommodation', desc: 'accommodationDesc' },
  { icon: Info, title: 'moreInfo', desc: 'moreInfoDesc' },
]

export default function VenueTravel() {
  const t = useTranslations('venue')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const travelRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

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

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: contentRef.current, start: 'top 82%' },
          }
        )
      }

      if (travelRef.current) {
        gsap.fromTo(
          travelRef.current.children,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: travelRef.current, start: 'top 85%' },
          }
        )
      }

      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: mapRef.current, start: 'top 90%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="venue" className="section-light border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-14 text-center">
          <p className="section-label">{t('label')}</p>
          <h2 className="section-heading">{t('title')}</h2>
          <p className="section-subheading mx-auto max-w-2xl">{t('subtitle')}</p>
        </div>

        <div
          ref={contentRef}
          className="relative mb-14 overflow-hidden bg-white lg:grid lg:grid-cols-2"
        >
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="border-border px-6 py-8 sm:px-8 lg:border-r lg:py-10 lg:pl-10 lg:pr-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{t('venue')}</h3>
            </div>

            <div className="divide-y divide-border">
              <div className="pb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {t('hostInstitution')}
                </p>
                <p className="mt-2 font-bold text-foreground">{t('fsbm')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t('h2c')}</p>
              </div>

              <div className="py-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {t('address')}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{t('addressValue')}</p>
              </div>

              <div className="pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {t('aboutCasablanca')}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t('aboutCasablancaDesc')}
                </p>
              </div>
            </div>
          </div>

          <div ref={travelRef} className="divide-y divide-border px-6 py-8 sm:px-8 lg:py-10 lg:pl-12 lg:pr-10">
            {travelItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-foreground">{t(title)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={mapRef}>
          <p className="font-bold text-foreground">{t('mapTitle')}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t('mapDesc')}
          </p>

          <div
            className="relative mt-6 w-full overflow-hidden rounded-xl"
            style={{ aspectRatio: '16/10', minHeight: '320px' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.4905454412437!2d-7.544054523992428!3d33.56661057334374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda633261bbe100f%3A0xe48b03dd8c6794a0!2sFacult%C3%A9%20des%20Sciences%20Ben%20M%E2%80%99Sick!5e0!3m2!1sfr!2sma!4v1772934740958!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              className="absolute inset-0 border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapTitle')}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
