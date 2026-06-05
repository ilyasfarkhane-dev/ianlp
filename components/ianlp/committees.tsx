'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import {
  Building2,
  GraduationCap,
  Mail,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const PC_CHAIR_COUNT = 6
const REVIEWER_COUNT = 12

function getInitial(name: string) {
  const cleaned = name.replace(/^(Prof\.?|Dr\.?|Pr\.?)\s+/i, '').trim()
  return cleaned.charAt(0).toUpperCase() || '?'
}

function MemberAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
      {getInitial(name)}
    </div>
  )
}

export default function Committees() {
  const t = useTranslations('committees')
  const tContact = useTranslations('contact')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pcRef = useRef<HTMLDivElement>(null)
  const pcCardsRef = useRef<HTMLDivElement>(null)
  const reviewersRef = useRef<HTMLDivElement>(null)
  const orgRef = useRef<HTMLDivElement>(null)

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

      if (pcRef.current) {
        gsap.fromTo(
          pcRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: pcRef.current, start: 'top 82%' },
          }
        )
      }

      if (pcCardsRef.current) {
        gsap.fromTo(
          pcCardsRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: { trigger: pcCardsRef.current, start: 'top 85%' },
          }
        )
      }

      if (reviewersRef.current) {
        gsap.fromTo(
          reviewersRef.current.children,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: { trigger: reviewersRef.current, start: 'top 88%' },
          }
        )
      }

      if (orgRef.current) {
        gsap.fromTo(
          orgRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: orgRef.current, start: 'top 90%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="committees" className="section-light bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-14 text-center">
          <p className="section-label">{t('label')}</p>
          <h2 className="section-heading">{t('title')}</h2>
          <p className="section-subheading mx-auto max-w-2xl">{t('subtitle')}</p>
        </div>

        <div ref={pcRef} className="relative mb-14 overflow-hidden bg-white">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
            <div className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:w-[min(100%,320px)] lg:flex-shrink-0 lg:px-10 lg:py-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {t('pcChairs')}
              </h3>
              <div className="mt-5 h-1 w-12 rounded-full bg-primary" aria-hidden />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {t('pcChairsSub')}
              </p>
            </div>

            <div
              ref={pcCardsRef}
              className="grid flex-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:p-8"
            >
              {Array.from({ length: PC_CHAIR_COUNT }, (_, i) => i + 1).map((i) => {
                const name = t(`pcChair${i}`)
                const affiliation = t(`pcChair${i}Aff`)
                return (
                  <article
                    key={`pc-chair-${i}`}
                    className="group flex gap-4 rounded-xl bg-slate-50/60 p-5 transition-colors duration-200 hover:bg-slate-50"
                  >
                    <MemberAvatar name={name} />
                    <div className="min-w-0">
                      <p className="font-bold text-foreground">{name}</p>
                      <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                        <GraduationCap
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                          aria-hidden
                        />
                        <span>{affiliation}</span>
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mb-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-label mb-2">{t('label')}</p>
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                {t('externalReviewers')}
              </h3>
            </div>
          </div>

          <div
            ref={reviewersRef}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: REVIEWER_COUNT }, (_, i) => i + 1).map((i) => {
              const name = t(`reviewer${i}Name`)
              const affiliation = t(`reviewer${i}Aff`)
              return (
                <article
                  key={`reviewer-${i}`}
                  className="group flex flex-col rounded-xl bg-white p-5 transition-colors duration-200 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={name} />
                    <p className="min-w-0 font-semibold text-foreground">{name}</p>
                  </div>
                  <p className="mt-4 flex items-start gap-2 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                    <GraduationCap
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>{affiliation}</span>
                  </p>
                </article>
              )
            })}
          </div>
        </div>

        <div ref={orgRef} className="relative overflow-hidden bg-white">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
            <div className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:w-[min(100%,300px)] lg:flex-shrink-0 lg:px-10 lg:py-10">
              <p className="section-label mb-3 text-primary">{t('label')}</p>
              <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {t('organizingCommittee')}
              </h3>
              <div className="mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
            </div>

            <div className="grid flex-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:p-8">
              <OrgCard
                icon={UserRound}
                label={t('generalChair')}
                title={t('profOmar')}
                lines={[t('fsbmH2c')]}
                footer={
                  <a
                    href="mailto:omar.zahour@univh2c.ma"
                    className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    <span>
                      {tContact('email')}: omar.zahour@univh2c.ma
                    </span>
                  </a>
                }
              />
              <OrgCard
                icon={Building2}
                label={t('organizingInstitution')}
                title={t('am2iFsbm')}
                lines={[t('h2cAddress')]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OrgCard({
  icon: Icon,
  label,
  title,
  lines,
  footer,
}: {
  icon: LucideIcon
  label: string
  title: string
  lines: string[]
  footer?: ReactNode
}) {
  return (
    <article className="group flex h-full flex-col rounded-xl bg-slate-50/60 p-6 transition-colors duration-200 hover:bg-slate-50">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</p>
      <p className="mt-2 font-bold text-foreground">{title}</p>
      {lines.map((line) => (
        <p key={line} className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {line}
        </p>
      ))}
      {footer}
    </article>
  )
}
