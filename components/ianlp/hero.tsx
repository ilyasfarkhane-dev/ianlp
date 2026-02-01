'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set([titleRef.current, subtitleRef.current, descRef.current, cardRef.current], {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.timeline().fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' },
          '-=0.4'
        )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center"
    >
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-semibold text-primary">
                New Conference Series
              </span>
            </div>

            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
            >
              IANLP 2026
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-muted-foreground mb-6 font-semibold"
            >
              1st International Conference on Artificial Intelligence for
              Natural Language Processing
            </p>

            <p
              ref={descRef}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl"
            >
              A premier international conference dedicated to advancing AI and NLP research,
              featuring Transformers, Large Language Models, RAG systems, and trustworthy
              language technologies. Join researchers and practitioners from around the world
              to share cutting-edge discoveries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#cfp"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#002bb8] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:shadow-primary/20"
              >
                Call for Papers <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#dates"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Important Dates
              </a>
            </div>
          </div>

          {/* Conference Snapshot Card */}
          <div ref={cardRef} className="relative">
            <Card className="p-8 bg-card border border-border/50 shadow-xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Event Details
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
                    Conference Snapshot
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">📅</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Dates
                      </p>
                      <p className="text-foreground font-semibold">
                        26–27 June 2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-bold">📍</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Venue
                      </p>
                      <p className="text-foreground font-semibold">
                        Faculty of Sciences Ben M'Sick (FSBM)
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Hassan II University of Casablanca
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-bold">📚</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Publication
                      </p>
                      <p className="text-foreground font-semibold">
                        Springer LNCS
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Proposed proceedings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground italic">
                    "Gathering researchers, academics, and practitioners to share advances
                    in NLP, Transformers, LLMs, and trustworthy AI."
                  </p>
                </div>
              </div>
            </Card>

            {/* Decorative gradient blur */}
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
