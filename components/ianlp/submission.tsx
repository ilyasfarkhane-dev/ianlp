'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Submission() {
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
      id="submission"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Submission Guidelines
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about submitting your research to IANLP 2026
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Submission Platform',
              description: 'EasyChair',
              items: ['Link to be added', 'Easy manuscript upload', 'Real-time status tracking'],
            },
            {
              title: 'Paper Format',
              description: 'Official LNCS Template',
              items: [
                'Available in Word & LaTeX',
                'Full papers: 12-15 pages',
                'Includes references',
              ],
            },
            {
              title: 'Key Requirements',
              description: 'Submission Policy',
              items: [
                'Original & unpublished work',
                'Double-blind (anonymized)',
                '3+ independent reviews',
              ],
            },
          ].map((card, idx) => (
            <div
              key={card.title}
              ref={(el) => {
                cardsRef.current[idx] = el
              }}
            >
              <Card className="p-6 h-full border border-border/50 hover:border-primary/30 transition-colors">
                <Badge className="mb-3">{card.description}</Badge>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {card.title}
                </h3>
                <ul className="space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        {/* Detailed Requirements Card */}
        <Card
          ref={(el) => {
            cardsRef.current[3] = el
          }}
          className="p-8 border border-border/50 bg-card"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Quality & Ethics Standards
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="font-semibold text-primary mb-3">Evaluation Criteria</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Novelty & originality of contributions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Technical soundness & methodology</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Significance & impact on field</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Clarity & presentation quality</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Relevance to IANLP scope</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-accent mb-3">Plagiarism & Integrity</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>Mandatory plagiarism screening</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>iThenticate preferred tool</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>Original work only required</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>Double-blind review process</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>Conflict-of-interest management</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
