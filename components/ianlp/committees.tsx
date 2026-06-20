'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import {
  Building2,
  ClipboardList,
  GraduationCap,
  Mail,
  Microscope,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { CommitteeIcon, PublicCommitteeMember, PublicCommitteesContent } from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

const ORG_ICON_MAP: Record<CommitteeIcon, LucideIcon> = {
  'user-round': UserRound,
  'building-2': Building2,
}

function getInitial(name: string) {
  const cleaned = name.replace(/^(Prof\.?|Dr\.?|Pr\.?|أ\.د\.)\s+/i, '').trim()
  return cleaned.charAt(0).toUpperCase() || '?'
}

function MemberAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
      {getInitial(name)}
    </div>
  )
}

type CommitteesProps = PublicCommitteesContent

export default function Committees({
  pcChairs,
  scientific,
  reviewers,
  institution,
  organizing,
}: CommitteesProps) {
  const t = useTranslations('committees')
  const tContact = useTranslations('contact')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pcRef = useRef<HTMLDivElement>(null)
  const pcCardsRef = useRef<HTMLDivElement>(null)
  const scientificRef = useRef<HTMLDivElement>(null)
  const reviewersRef = useRef<HTMLDivElement>(null)
  const institutionRef = useRef<HTMLDivElement>(null)
  const orgRef = useRef<HTMLDivElement>(null)
  const organizingRef = useRef<HTMLDivElement>(null)

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

      if (scientificRef.current) {
        gsap.fromTo(
          scientificRef.current.children,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: { trigger: scientificRef.current, start: 'top 86%' },
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

      if (institutionRef.current) {
        gsap.fromTo(
          institutionRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: institutionRef.current, start: 'top 90%' },
          }
        )
      }

      if (organizingRef.current) {
        gsap.fromTo(
          organizingRef.current.children,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: { trigger: organizingRef.current, start: 'top 92%' },
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

        {pcChairs.length > 0 && (
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
                {pcChairs.map((member) => (
                  <article
                    key={member.id}
                    className="group flex gap-4 rounded-xl bg-slate-50/60 p-5 transition-colors duration-200 hover:bg-slate-50"
                  >
                    <MemberAvatar name={member.name} />
                    <div className="min-w-0">
                      <p className="font-bold text-foreground">{member.name}</p>
                      {member.affiliation.trim().length > 0 && (
                        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                          <GraduationCap
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                            aria-hidden
                          />
                          <span>{member.affiliation}</span>
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {scientific.length > 0 && (
          <div className="mb-14">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Microscope className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="section-label mb-0">{t('label')}</p>
                </div>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {t('scientificCommittee')}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {t('scientificCommitteeSub')}
                </p>
              </div>
            </div>

            <div
              ref={scientificRef}
              className="grid gap-4 rounded-2xl border border-border/60 bg-white p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3"
            >
              {scientific.map((member) => (
                <article
                  key={member.id}
                  className="group flex flex-col rounded-xl bg-slate-50/60 p-5 transition-colors duration-200 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={member.name} />
                    <p className="min-w-0 font-semibold text-foreground">{member.name}</p>
                  </div>
                  {member.affiliation.trim().length > 0 && (
                    <p className="mt-4 flex items-start gap-2 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                      <GraduationCap
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{member.affiliation}</span>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {reviewers.length > 0 && (
          <div className="mb-14">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="section-label mb-2">{t('label')}</p>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {t('externalReviewers')}
                </h3>
              </div>
            </div>

            <div ref={reviewersRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviewers.map((member) => (
                <article
                  key={member.id}
                  className="group flex flex-col rounded-xl bg-white p-5 transition-colors duration-200 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={member.name} />
                    <p className="min-w-0 font-semibold text-foreground">{member.name}</p>
                  </div>
                  {member.affiliation.trim().length > 0 && (
                    <p className="mt-4 flex items-start gap-2 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                      <GraduationCap
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{member.affiliation}</span>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {institution.length > 0 && (
          <div ref={institutionRef} className="relative mb-14 overflow-hidden bg-white">
            <div
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
              aria-hidden
            />

            <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
              <div className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:w-[min(100%,300px)] lg:flex-shrink-0 lg:px-10 lg:py-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" aria-hidden />
                </div>
                <p className="section-label mb-3 text-primary">{t('label')}</p>
                <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {t('institutionCommittee')}
                </h3>
                <div className="mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {t('institutionCommitteeSub')}
                </p>
              </div>

              <div className="grid flex-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:p-8">
                {institution.map((member) => {
                  const Icon = member.icon ? ORG_ICON_MAP[member.icon] : UserRound

                  return (
                    <OrgCard
                      key={member.id}
                      icon={Icon}
                      label={member.roleLabel}
                      title={member.name}
                      lines={member.affiliation.trim() ? [member.affiliation] : []}
                      footer={
                        member.email ? (
                          <a
                            href={`mailto:${member.email}`}
                            className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                          >
                            <Mail className="h-4 w-4" aria-hidden />
                            <span>
                              {tContact('email')}: {member.email}
                            </span>
                          </a>
                        ) : undefined
                      }
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {organizing.length > 0 && (
          <div ref={orgRef} className="relative overflow-hidden bg-white">
            <div
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
              aria-hidden
            />

            <div className="mb-8 flex flex-col gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ClipboardList className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="section-label mb-0">{t('label')}</p>
                </div>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {t('organizingCommittee')}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {t('organizingCommitteeSub')}
                </p>
              </div>
            </div>

            <div
              ref={organizingRef}
              className="grid gap-4 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8 lg:grid-cols-3"
            >
              {organizing.map((member) => (
                <article
                  key={member.id}
                  className="group flex flex-col rounded-xl bg-slate-50/60 p-5 transition-colors duration-200 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={member.name} />
                    <p className="min-w-0 font-semibold text-foreground">{member.name}</p>
                  </div>
                  {member.affiliation.trim().length > 0 && (
                    <p className="mt-4 flex items-start gap-2 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                      <GraduationCap
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{member.affiliation}</span>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
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
      {label.trim().length > 0 && (
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</p>
      )}
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
