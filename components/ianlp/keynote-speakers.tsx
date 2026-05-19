'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

gsap.registerPlugin(ScrollTrigger)

const keynoteTopicKeys = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6']
const speakerIds = [1, 2, 3, 4] as const

const speakerImages: Record<(typeof speakerIds)[number], string> = {
  1: '/speakers/Jaouad DABOUNOU.jpeg',
  2: '/speakers/speaker-2.jpg',
  3: '/speakers/speaker-3.jpg',
  4: '/speakers/speaker-4.jpg',
}

function SpeakerCard({ id }: { id: (typeof speakerIds)[number] }) {
  const t = useTranslations('keynote')
  const [imgError, setImgError] = useState(false)
  const name = t(`speaker${id}Name`)
  const affiliation = t(`speaker${id}Affiliation`)
  const bio = t(`speaker${id}Bio`)
  const hasAffiliation = affiliation.trim().length > 0

  return (
    <Card className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/40 transition-colors">
      <div className="w-full bg-primary/10">
        {!imgError ? (
          <Image
            src={speakerImages[id]}
            alt={name}
            width={400}
            height={400}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex min-h-48 items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/30">
              <User className="h-12 w-12 text-primary" />
            </div>
          </div>
        )}
      </div>
      <div className="p-6 space-y-2 text-center">
        <h3 className="text-lg font-bold text-foreground">{name}</h3>
        {hasAffiliation && (
          <p className="text-sm font-medium text-primary">{affiliation}</p>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              {t('seeBiography')}
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-background sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
              {hasAffiliation && (
                <p className="text-sm font-medium text-primary">{affiliation}</p>
              )}
            </DialogHeader>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground text-justify">
              {bio}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  )
}

export default function KeynoteSpeakers() {
  const t = useTranslations('keynote')
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(contentRef.current, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
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
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={contentRef}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {keynoteTopicKeys.map((key) => (
            <div
              key={key}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 backdrop-blur-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <p className="font-semibold text-foreground">{t(key)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakerIds.map((id) => (
            <SpeakerCard key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  )
}
