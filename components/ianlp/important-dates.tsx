'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '@/components/ui/card'

gsap.registerPlugin(ScrollTrigger)

const dates = [
  {
    label: 'Paper Submission Deadline',
    date: '15 March 2026',
    description: 'Submit your original research papers',
  },
  {
    label: 'Notification of Acceptance',
    date: '30 April 2026',
    description: 'Receive review results and decisions',
  },
  {
    label: 'Camera-Ready Deadline',
    date: '15 May 2026',
    description: 'Submit final papers incorporating reviews',
  },
  {
    label: 'Conference Dates',
    date: '26–27 June 2026',
    description: 'IANLP 2026 takes place in Casablanca',
  },
]

export default function ImportantDates() {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(timelineRef.current.filter((t) => t !== null), {
        opacity: 1,
        x: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineRef.current.filter((t) => t !== null),
        {
          opacity: 0,
          x: (index) => (index % 2 === 0 ? -30 : 30),
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
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
      id="dates"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Important Dates
          </h2>
          <p className="text-lg text-muted-foreground">
            Key milestones for IANLP 2026
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {dates.map((item, index) => (
            <div
              key={item.label}
              ref={(el) => {
                timelineRef.current[index] = el
              }}
            >
              <Card className="p-6 h-full border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#002bb8] text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-2">
                      {item.date}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
