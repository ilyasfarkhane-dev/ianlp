'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ArrowRight, GraduationCap, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { PublicSpeaker } from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

function SpeakerCard({
  speaker,
  className,
}: {
  speaker: PublicSpeaker
  className?: string
}) {
  const t = useTranslations('keynote')
  const [imgError, setImgError] = useState(false)
  const { name, affiliation, bio, imagePath } = speaker
  const university = affiliation.trim()
  const role = university.length > 0 ? university : t('keynoteRole')

  return (
    <Dialog>
      <article
        className={cn(
          'speaker-editorial-card group flex flex-col rounded-3xl p-5 text-left max-lg:p-4',
          className
        )}
      >
        <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/15 max-lg:mb-4 max-lg:aspect-[3/4]">
          {!imgError && imagePath ? (
            <Image
              src={imagePath}
              alt={name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 320px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-white/10">
              <User className="h-12 w-12 text-white/40" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold leading-snug text-primary-foreground max-lg:text-base">{name}</h3>

        {university ? (
          <span className="mt-3 inline-flex w-full max-w-full items-start gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-medium text-primary-foreground max-lg:mt-2">
            <GraduationCap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary-foreground" aria-hidden />
            <span className="leading-snug whitespace-normal">{university}</span>
          </span>
        ) : null}

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75 max-lg:mt-2">{bio}</p>

        <div className="mt-5 max-lg:mt-4">
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary-foreground underline-offset-4 transition-all duration-200 hover:gap-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground max-lg:min-h-11"
            >
              {t('seeBiography')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </DialogTrigger>
        </div>
      </article>

      <DialogContent
        className="gap-0 overflow-hidden rounded-3xl border-0 p-0 sm:max-w-2xl max-sm:flex max-sm:max-h-[90dvh] max-sm:flex-col [&_[data-slot=dialog-close]]:top-5 [&_[data-slot=dialog-close]]:right-5 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:text-primary-foreground [&_[data-slot=dialog-close]]:opacity-90 [&_[data-slot=dialog-close]]:hover:bg-white/15 [&_[data-slot=dialog-close]]:hover:opacity-100 max-sm:[&_[data-slot=dialog-close]]:top-4 max-sm:[&_[data-slot=dialog-close]]:right-4 max-sm:[&_[data-slot=dialog-close]]:flex max-sm:[&_[data-slot=dialog-close]]:min-h-11 max-sm:[&_[data-slot=dialog-close]]:min-w-11 max-sm:[&_[data-slot=dialog-close]]:items-center max-sm:[&_[data-slot=dialog-close]]:justify-center"
        showCloseButton
      >
        <div className="bg-primary px-6 pb-6 pt-8 text-primary-foreground sm:px-8 max-sm:flex-shrink-0 max-sm:px-5 max-sm:pb-5 max-sm:pt-7">
          <DialogHeader className="gap-3 pr-10 text-left max-sm:pr-12">
            <DialogTitle className="text-2xl font-bold leading-tight max-sm:text-xl">{name}</DialogTitle>
            {university ? (
              <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-medium">
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
                <span className="leading-snug">{university}</span>
              </span>
            ) : (
              <p className="text-sm font-medium text-primary-foreground/90">{role}</p>
            )}
          </DialogHeader>
        </div>

        <div className="max-h-[min(60vh,520px)] overflow-y-auto bg-white p-6 sm:p-8 max-sm:min-h-0 max-sm:flex-1 max-sm:overscroll-y-contain max-sm:p-5">
          <div className="grid items-start gap-6 sm:grid-cols-[160px_1fr] sm:gap-8 max-sm:gap-5">
            <div className="mx-auto w-full max-w-[160px] overflow-hidden rounded-2xl border border-border sm:mx-0 sm:max-w-none max-sm:max-w-[140px]">
              {!imgError && imagePath ? (
                <Image
                  src={imagePath}
                  alt={name}
                  width={160}
                  height={200}
                  className="block h-auto w-full"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-muted">
                  <User className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="section-label mb-3 text-left">{t('bioLabel')}</p>
              <DialogDescription className="text-justify text-base leading-relaxed text-muted-foreground max-sm:text-left">
                {bio}
              </DialogDescription>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type KeynoteSpeakersProps = {
  speakers: PublicSpeaker[]
}

export default function KeynoteSpeakers({ speakers }: KeynoteSpeakersProps) {
  const t = useTranslations('keynote')
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
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

      const cards = cardsRef.current?.querySelectorAll('.speaker-editorial-card')
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [showAll, speakers.length])

  if (speakers.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} id="speakers" className="section-light overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        {showAll ? (
          <>
            <div ref={introRef} className="mx-auto mb-12 max-w-2xl text-center">
              <p className="section-label">{t('label')}</p>
              <h2 className="section-heading">{t('title')}</h2>
              <p className="section-subheading">{t('subtitle')}</p>

              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="mt-8 cursor-pointer text-sm font-semibold text-primary transition-colors duration-200 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-lg:min-h-11"
              >
                {t('backToOverview')}
              </button>
            </div>

            <div
              ref={cardsRef}
              className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            >
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} className="h-full w-full" />
              ))}
            </div>
          </>
        ) : (
          <div className="lg:flex lg:items-start lg:gap-10 xl:gap-14">
            <div ref={introRef} className="lg:w-[38%] lg:max-w-md lg:flex-shrink-0 xl:w-[34%]">
              <p className="section-label">{t('label')}</p>
              <h2 className="section-heading">{t('title')}</h2>
              <p className="section-subheading mb-8 max-w-md">{t('subtitle')}</p>

              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="btn-outline-dark inline-flex w-fit cursor-pointer items-center gap-2 px-6 py-2.5 text-sm max-lg:w-full max-lg:min-h-11 max-lg:justify-center max-lg:py-3"
              >
                {t('seeAllKeynote')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div
              ref={cardsRef}
              className="mt-10 min-w-0 flex-1 lg:mt-0 lg:flex lg:snap-x lg:snap-mandatory lg:gap-5 lg:overflow-x-visible lg:pb-2 lg:pr-[max(1rem,calc((100vw-80rem)/2+2rem))]"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:contents">
                {speakers.map((speaker) => (
                  <SpeakerCard
                    key={speaker.id}
                    speaker={speaker}
                    className="h-full w-full lg:w-[320px] lg:flex-shrink-0 lg:snap-start"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
