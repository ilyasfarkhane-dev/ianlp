'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const committees = {
  'External Reviewers': [
    {
      name: 'Prof. Ángel Ruiz Zafra',
      affiliation: 'University of Granada, Spain',
    },
    {
      name: 'Dr. Kawtar Benghazi Akhlaki Sekkate',
      affiliation: 'University of Granada, Spain',
    },
    {
      name: 'Prof. Olivier Debauche',
      affiliation: 'University of Liège, Belgium',
    },
    {
      name: 'Prof. Anderson Rocha',
      affiliation: 'University of Campinas (UNICAMP), Brazil',
    },
    {
      name: 'Prof. Mamadou Lamine Gueye',
      affiliation: 'University of Pau and Pays de l\'Adour, France',
    },
    {
      name: 'Prof. Rachid Saadane',
      affiliation: 'EHTP, Hassan II University of Casablanca, Morocco',
    },
  ],
}

export default function Committees() {
  const t = useTranslations('committees')
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
          stagger: 0.08,
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
      id="committees"
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

        <div>
          <h3 className="text-2xl font-bold text-foreground mb-8">
            {t('externalReviewers')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees['External Reviewers'].map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
              >
                <Card className="p-6 border border-border/50 hover:border-primary/30 transition-all hover:shadow-md h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#002bb8] text-white flex items-center justify-center font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {member.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
                    <Globe className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      {member.affiliation}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 p-8 bg-card border border-border/50 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {t('officeMembers')}
          </h3>
          <p className="text-muted-foreground mb-6">{t('officeMembersSub')}</p>
          <ul className="space-y-2 text-foreground">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#002bb8]">•</span>
                <span>{t(`office${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 p-8 bg-card border border-border/50 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            {t('organizingCommittee')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-primary mb-2">{t('generalChair')}</p>
              <p className="text-foreground font-semibold">{t('profOmar')}</p>
              <p className="text-sm text-muted-foreground">
                {t('fsbmH2c')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Email:{' '}
                <a
                  href="mailto:omar.zahour@univh2c.ma"
                  className="text-primary hover:underline"
                >
                  omar.zahour@univh2c.ma
                </a>
              </p>
            </div>
            <div>
              <p className="font-bold text-accent mb-2">{t('organizingInstitution')}</p>
              <p className="text-foreground font-semibold">{t('am2iFsbm')}</p>
              <p className="text-sm text-muted-foreground">
                {t('h2cAddress')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
