'use client'

import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Mail, MapPin, Phone, UserRound, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PublicContactInfo, PublicPartner } from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

function PartnerLogo({ partner }: { partner: PublicPartner }) {
  const image = (
    <Image
      src={partner.logoPath}
      alt={partner.altText}
      width={180}
      height={90}
      className="h-12 w-auto max-w-[120px] object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100 sm:h-14 sm:max-w-[140px] lg:h-16 lg:max-w-[160px]"
    />
  )

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
        aria-label={partner.altText}
      >
        {image}
      </a>
    )
  }

  return image
}

function PartnersRow({
  partners,
  rowRef,
}: {
  partners: PublicPartner[]
  rowRef: RefObject<HTMLDivElement | null>
}) {
  const lastIndex = partners.length - 1

  if (partners.length === 0) return null

  return (
    <div className="lg:mx-0 lg:overflow-visible lg:px-0">
      <div
        ref={rowRef}
        className={cn(
          'grid grid-cols-2 justify-items-center gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8',
          'lg:flex lg:min-w-0 lg:flex-nowrap lg:items-center lg:justify-between lg:gap-6 xl:gap-10'
        )}
      >
        {partners.map((partner, index) => (
          <div
            key={partner.id}
            className={cn(
              'partner-logo group flex flex-shrink-0 items-center justify-center px-1 max-lg:min-h-[4.5rem]',
              index === lastIndex && partners.length % 2 === 1 && 'max-sm:col-span-2',
              index === lastIndex && partners.length % 3 === 1 && 'sm:max-lg:col-span-3'
            )}
          >
            <PartnerLogo partner={partner} />
          </div>
        ))}
      </div>
    </div>
  )
}

type ContactProps = {
  partners: PublicPartner[]
  contact: PublicContactInfo
}

export default function Contact({ partners, contact }: ContactProps) {
  const t = useTranslations('contact')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const partnersHeaderRef = useRef<HTMLDivElement>(null)
  const partnersRowRef = useRef<HTMLDivElement>(null)

  const contactItems: {
    icon: LucideIcon
    label: string
    value: string
    href?: string
  }[] = [
    {
      icon: Phone,
      label: t('phone'),
      value: contact.phoneDisplay,
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      label: t('address'),
      value: contact.address,
    },
  ]

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

      if (contactRef.current) {
        gsap.fromTo(
          contactRef.current.children,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: contactRef.current, start: 'top 85%' },
          }
        )
      }

      if (partnersHeaderRef.current) {
        gsap.fromTo(
          partnersHeaderRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: partnersHeaderRef.current, start: 'top 90%' },
          }
        )
      }

      if (partnersRowRef.current) {
        gsap.fromTo(
          partnersRowRef.current.children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: { trigger: partnersRowRef.current, start: 'top 92%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [partners.length])

  return (
    <section ref={sectionRef} id="contact" className="section-light border-t border-border bg-white">
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-14 text-center">
          <p className="section-label">{t('label')}</p>
          <h2 className="section-heading">{t('title')}</h2>
          <p className="section-subheading mx-auto max-w-2xl">{t('subtitle')}</p>
        </div>

        <div
          ref={contentRef}
          className="relative mb-16 overflow-hidden bg-muted/20 lg:grid lg:grid-cols-2"
        >
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="border-border px-6 py-8 sm:px-8 lg:border-r lg:py-10 lg:pl-10 lg:pr-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{t('quickContact')}</h3>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{t('reachOut')}</p>

            <div ref={contactRef} className="divide-y divide-border">
              <div className="flex gap-5 py-6 first:pt-0">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {t('email')}
                  </p>
                  <div className="mt-2 space-y-2">
                    {contact.emails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="block cursor-pointer text-sm font-semibold text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-2 inline-block cursor-pointer text-sm font-semibold text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 lg:py-10 lg:pl-12 lg:pr-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{t('programChair')}</h3>
            </div>

            <div className="divide-y divide-border">
              {contact.programChairs.map((chair, index) => (
                <div key={`${chair.name}-${index}`} className="space-y-6 py-6 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {t('name')}
                    </p>
                    <p className="mt-2 text-lg font-bold text-foreground">{chair.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {t('affiliation')}
                    </p>
                    <p className="mt-2 font-semibold text-foreground">{chair.affiliationPrimary}</p>
                    {chair.affiliationSecondary ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {chair.affiliationSecondary}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-16">
          <div ref={partnersHeaderRef} className="mb-12 text-center lg:mb-14">
            <p className="section-label">{t('partnersLabel')}</p>
            <h3 className="section-heading mb-4">{t('partnersTitle')}</h3>
            <div className="mx-auto h-1 w-12 rounded-full bg-primary" aria-hidden />
          </div>

          <PartnersRow partners={partners} rowRef={partnersRowRef} />
        </div>
      </div>
    </section>
  )
}
