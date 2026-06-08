'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import {
  Check,
  Clock,
  ExternalLink,
  Mail,
  Ticket,
  Video,
  Workflow,
  X,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type {
  PublicPricingTier,
  PublicRegisterPageContent,
  PublicWorkshop,
  WorkshopIcon,
} from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

const WORKSHOP_ICON_MAP: Record<WorkshopIcon, LucideIcon> = {
  video: Video,
  workflow: Workflow,
}

type RegisterProps = {
  tiers: PublicPricingTier[]
  workshops: PublicWorkshop[]
  pageContent: PublicRegisterPageContent
  showHeader?: boolean
  variant?: 'section' | 'page'
}

function useRegisterAnimations(
  sectionRef: React.RefObject<HTMLElement | null>,
  headerRef: React.RefObject<HTMLDivElement | null>,
  feesPanelRef: React.RefObject<HTMLDivElement | null>,
  feeCardsRef: React.RefObject<HTMLDivElement | null>,
  workshopsPanelRef: React.RefObject<HTMLDivElement | null>,
  workshopCardsRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !enabled || !sectionRef.current) return

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
          },
        )
      }

      if (feesPanelRef.current) {
        gsap.fromTo(
          feesPanelRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: feesPanelRef.current, start: 'top 85%' },
          },
        )
      }

      if (feeCardsRef.current) {
        gsap.fromTo(
          feeCardsRef.current.children,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: feeCardsRef.current, start: 'top 88%' },
          },
        )
      }

      if (workshopsPanelRef.current) {
        gsap.fromTo(
          workshopsPanelRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: workshopsPanelRef.current, start: 'top 85%' },
          },
        )
      }

      if (workshopCardsRef.current) {
        gsap.fromTo(
          workshopCardsRef.current.children,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: workshopCardsRef.current, start: 'top 88%' },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [enabled, sectionRef, headerRef, feesPanelRef, feeCardsRef, workshopsPanelRef, workshopCardsRef])
}

function PricingTierCard({
  tier,
  tPricing,
}: {
  tier: PublicPricingTier
  tPricing: ReturnType<typeof useTranslations>
}) {
  return (
    <article className="group flex h-full flex-col rounded-xl bg-slate-50/60 p-5 transition-colors duration-200 hover:bg-slate-50">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
          <Ticket className="h-5 w-5" aria-hidden />
        </div>
        {tier.isFeatured ? (
          <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
            {tPricing('bestPlanBadge')}
          </span>
        ) : null}
      </div>

      <h4 className="font-bold uppercase tracking-[0.08em] text-foreground">{tier.name}</h4>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-sm font-medium text-muted-foreground">{tier.currency}</span>
        <span className="text-3xl font-bold leading-none text-primary">{tier.price}</span>
      </div>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-border/70 pt-5">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm leading-snug text-foreground">
            <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function ConferenceFeesBlock({
  pageContent,
  tPricing,
  tiers,
  feesPanelRef,
  feeCardsRef,
}: {
  pageContent: PublicRegisterPageContent
  tPricing: ReturnType<typeof useTranslations>
  tiers: PublicPricingTier[]
  feesPanelRef: React.RefObject<HTMLDivElement | null>
  feeCardsRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={feesPanelRef} className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
        aria-hidden
      />

      <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
        <div className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:w-[min(100%,340px)] lg:flex-shrink-0 lg:px-10 lg:py-10">
          <p className="section-label mb-3 text-primary">{pageContent.conferenceStep}</p>
          <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {pageContent.feesTitle}
          </h3>
          <div className="mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{pageContent.feesSubtitle}</p>
        </div>

        <div
          ref={feeCardsRef}
          className={cn(
            'grid flex-1 gap-4 p-6 sm:p-8 lg:p-8',
            tiers.length === 1
              ? 'mx-auto w-full max-w-md sm:grid-cols-1'
              : 'sm:grid-cols-2',
          )}
        >
          {tiers.map((tier) => (
            <PricingTierCard key={tier.id} tier={tier} tPricing={tPricing} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WorkshopCard({
  workshop,
  animatorLabel,
  registerWorkshopLabel,
}: {
  workshop: PublicWorkshop
  animatorLabel: string
  registerWorkshopLabel: string
}) {
  const t = useTranslations('register')
  const Icon = WORKSHOP_ICON_MAP[workshop.icon]
  const [imgError, setImgError] = useState(false)
  const hasImage = Boolean(workshop.imagePath) && !imgError

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-slate-50/60 transition-colors duration-200 hover:bg-slate-50">
      <div className="group/image relative aspect-[16/10] overflow-hidden bg-primary/5">
        {hasImage ? (
          <Dialog>
            <>
              <Image
                src={workshop.imagePath!}
                alt={workshop.title}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                onError={() => setImgError(true)}
              />
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200',
                  'group-hover/image:bg-black/45 group-focus-within/image:bg-black/45',
                  'max-sm:bg-black/20',
                )}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/95 px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg',
                      'opacity-0 transition-opacity duration-200 group-hover/image:opacity-100 group-focus-within/image:opacity-100',
                      'focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                      'max-sm:opacity-100',
                    )}
                  >
                    <ZoomIn className="h-4 w-4" aria-hidden />
                    {t('viewWorkshopImage')}
                  </button>
                </DialogTrigger>
              </div>
            </>

            <DialogContent
              className="w-fit max-w-[calc(100vw-2rem)] gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-none"
              showCloseButton={false}
            >
              <DialogHeader className="sr-only">
                <DialogTitle>{workshop.title}</DialogTitle>
                <DialogDescription>{workshop.subtitle}</DialogDescription>
              </DialogHeader>
              <div className="relative inline-block leading-none">
                <Image
                  src={workshop.imagePath!}
                  alt={workshop.title}
                  width={1200}
                  height={1600}
                  className="block h-auto max-h-[85vh] w-auto max-w-[min(calc(100vw-4rem),900px)] rounded-2xl shadow-2xl ring-1 ring-black/10"
                  sizes="(max-width: 1024px) 92vw, 900px"
                />
                <DialogClose
                  className="absolute -right-16 -top-4 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/95 text-foreground shadow-lg transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-right-20 sm:-top-5 sm:h-12 sm:w-12"
                >
                  <X className="h-5 w-5" aria-hidden />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden />
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/35 to-transparent" aria-hidden />
        <span className="absolute right-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-sm">
          {workshop.badgeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-bold leading-snug text-foreground">{workshop.title}</h4>
        <p className="mt-1.5 text-xs font-medium text-primary">{workshop.subtitle}</p>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{workshop.description}</p>

        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{animatorLabel}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{workshop.animator}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{workshop.animatorRole}</p>
        </div>

        <ul className="mt-4 space-y-2">
          {workshop.program.map((item) => (
            <li key={item} className="flex gap-2 text-xs leading-snug text-foreground">
              <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden />
            {workshop.duration}
          </span>
          <span className="font-semibold text-primary">{workshop.fee}</span>
        </div>

        <a
          href={workshop.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 w-full gap-2 text-sm"
        >
          {registerWorkshopLabel}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  )
}

function WorkshopsBlock({
  pageContent,
  workshops,
  animatorLabel,
  registerWorkshopLabel,
  workshopsPanelRef,
  workshopCardsRef,
}: {
  pageContent: PublicRegisterPageContent
  workshops: PublicWorkshop[]
  animatorLabel: string
  registerWorkshopLabel: string
  workshopsPanelRef: React.RefObject<HTMLDivElement | null>
  workshopCardsRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={workshopsPanelRef} className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
        aria-hidden
      />

      <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
        <div className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:w-[min(100%,340px)] lg:flex-shrink-0 lg:px-10 lg:py-10">
          <p className="section-label mb-3 text-primary">{pageContent.workshopsBadge}</p>
          <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {pageContent.workshopsTitle}
          </h3>
          <div className="mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{pageContent.workshopsSubtitle}</p>
          <p className="mt-4 text-sm font-medium text-orange-700">{pageContent.limitedSpots}</p>
        </div>

        <div
          ref={workshopCardsRef}
          className="grid flex-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:p-8"
        >
          {workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              animatorLabel={animatorLabel}
              registerWorkshopLabel={registerWorkshopLabel}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Register({
  tiers,
  workshops,
  pageContent,
  showHeader = true,
  variant = 'section',
}: RegisterProps) {
  const t = useTranslations('register')
  const tPricing = useTranslations('pricing')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const feesPanelRef = useRef<HTMLDivElement>(null)
  const feeCardsRef = useRef<HTMLDivElement>(null)
  const workshopsPanelRef = useRef<HTMLDivElement>(null)
  const workshopCardsRef = useRef<HTMLDivElement>(null)
  const isPage = variant === 'page'

  useRegisterAnimations(
    sectionRef,
    headerRef,
    feesPanelRef,
    feeCardsRef,
    workshopsPanelRef,
    workshopCardsRef,
    true,
  )

  if (isPage) {
    return (
      <div>
        <section
          id="conference-fees"
          className="scroll-mt-28 bg-muted/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <ConferenceFeesBlock
              pageContent={pageContent}
              tPricing={tPricing}
              tiers={tiers}
              feesPanelRef={feesPanelRef}
              feeCardsRef={feeCardsRef}
            />
          </div>
        </section>

        <section id="workshops" className="scroll-mt-28 bg-muted/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <WorkshopsBlock
              pageContent={pageContent}
              workshops={workshops}
              animatorLabel={t('animator')}
              registerWorkshopLabel={t('registerWorkshop')}
              workshopsPanelRef={workshopsPanelRef}
              workshopCardsRef={workshopCardsRef}
            />
          </div>
        </section>

        <section className="border-t border-border bg-navy px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{pageContent.helpTitle}</p>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{pageContent.helpSubtitle}</h2>
            </div>
            <a
              href={`mailto:${pageContent.helpEmail}`}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {t('contactUs')}
            </a>
          </div>
        </section>
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="register"
      className="border-t border-primary/10 bg-primary/[0.06] px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {showHeader ? (
          <div ref={headerRef} className="mx-auto mb-16 max-w-2xl text-center lg:mb-20">
            <p className="section-label">{t('label')}</p>
            <h2 className="section-heading">{pageContent.pageTitle}</h2>
            <p className="section-subheading">{pageContent.pageSubtitle}</p>
            <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
          </div>
        ) : null}

        <div className="mb-20 lg:mb-24">
          <ConferenceFeesBlock
            pageContent={pageContent}
            tPricing={tPricing}
            tiers={tiers}
            feesPanelRef={feesPanelRef}
            feeCardsRef={feeCardsRef}
          />
        </div>

        <WorkshopsBlock
          pageContent={pageContent}
          workshops={workshops}
          animatorLabel={t('animator')}
          registerWorkshopLabel={t('registerWorkshop')}
          workshopsPanelRef={workshopsPanelRef}
          workshopCardsRef={workshopCardsRef}
        />
      </div>
    </section>
  )
}
