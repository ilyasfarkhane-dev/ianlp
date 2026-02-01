'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '@/components/ui/card'

gsap.registerPlugin(ScrollTrigger)

export default function KeynoteSpeakers() {
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
            Keynote Speakers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Keynote speakers will be announced soon. IANLP 2026 will invite internationally
            recognized speakers in emerging topics such as:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            'Large Language Models (LLMs)',
            'Transformer Architectures',
            'Retrieval-Augmented Generation (RAG)',
            'Multilingual NLP',
            'Trustworthy & Explainable AI',
            'Prompt Engineering',
          ].map((topic) => (
            <div
              key={topic}
              className="p-6 bg-card border border-border/50 rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#002bb8]" />
                <p className="font-semibold text-foreground">{topic}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder Card */}
        <Card className="p-12 text-center border border-border/50 bg-[#002bb8]/5">
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#002bb8]/20 mx-auto flex items-center justify-center">
              <span className="text-2xl">🎤</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              Distinguished Speakers Coming Soon
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check back for updates on keynote speakers and presentation details.
              We're bringing together the brightest minds in AI and NLP for IANLP 2026.
            </p>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Stay tuned for announcements!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
