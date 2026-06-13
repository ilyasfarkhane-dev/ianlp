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
  PublicRegisterPageContent,
  PublicWorkshop,
  WorkshopIcon,
} from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

const WORKSHOP_ICON_MAP: Record<WorkshopIcon, LucideIcon> = {
  video: Video,
  workflow: Workflow,
}

type WorkshopsSectionProps = {
  workshops: PublicWorkshop[]
  pageContent: PublicRegisterPageContent
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

export default function WorkshopsSection({ workshops, pageContent }: WorkshopsSectionProps) {
  const t = useTranslations('register')
  const sectionRef = useRef<HTMLElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      if (sidebarRef.current) {
        gsap.fromTo(
          sidebarRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: sidebarRef.current, start: 'top 85%' },
          },
        )
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 88%' },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (workshops.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id="workshops"
      className="scroll-mt-28 border-t border-primary/10 bg-muted/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative bg-white">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            aria-hidden
          />

          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-0 lg:p-0">
            <aside
              ref={sidebarRef}
              className="flex flex-col justify-center bg-primary/[0.04] px-6 py-8 sm:px-8 lg:sticky lg:top-28 lg:w-[min(100%,340px)] lg:flex-shrink-0 lg:self-start lg:px-10 lg:py-10"
            >
              <p className="section-label mb-3 text-primary">{pageContent.workshopsBadge}</p>
              <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {pageContent.workshopsTitle}
              </h2>
              <div className="mt-6 h-1 w-12 rounded-full bg-primary" aria-hidden />
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{pageContent.workshopsSubtitle}</p>
              <p className="mt-4 text-sm font-medium text-orange-700">{pageContent.limitedSpots}</p>
            </aside>

            <div
              ref={cardsRef}
              className="grid flex-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:p-8"
            >
              {workshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  animatorLabel={t('animator')}
                  registerWorkshopLabel={t('registerWorkshop')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
