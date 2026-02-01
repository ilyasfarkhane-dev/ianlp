'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function CFPSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set([contentRef.current, ...cardsRef.current.filter((c) => c !== null)], {
        opacity: 1,
        y: 0,
      })
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

      gsap.fromTo(
        cardsRef.current.filter((c) => c !== null),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
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
      id="cfp"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-transparent"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={contentRef}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Call for Papers
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
            IANLP 2026 invites original and unpublished research contributions in Artificial
            Intelligence for Natural Language Processing. Submissions must present novel
            scientific results and be written in English.
          </p>
          <a
            href="#submission"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#002bb8] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:shadow-primary/20"
          >
            Submit Your Research
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: 'Publication',
              items: [
                'Springer LNCS proceedings',
                'Subject to Springer editorial approval',
                'Full compliance with LNCS standards',
              ],
            },
            {
              title: 'Submission Requirements',
              items: [
                'LNCS format (Word/LaTeX template)',
                'Double-blind review (anonymized)',
                'Full papers: 12-15 pages',
                'Includes references',
              ],
            },
          ].map((section, idx) => (
            <div
              key={section.title}
              ref={(el) => {
                cardsRef.current[idx] = el
              }}
            >
              <Card className="p-8 h-full border border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-foreground/80"
                    >
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="p-8 bg-[#002bb8]/10 border border-[#002bb8]/20 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">Ready to submit your research?</p>
          <Button
            disabled
            size="lg"
            className="bg-[#002bb8] text-white"
            title="Coming soon"
          >
            Submit Paper on EasyChair (Coming Soon)
          </Button>
        </div>
      </div>
    </section>
  )
}
