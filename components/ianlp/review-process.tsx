'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

gsap.registerPlugin(ScrollTrigger)

export default function ReviewProcess() {
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
      id="review"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={contentRef}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Review Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            IANLP 2026 applies a strict double-blind peer-review process aligned with
            Springer LNCS quality expectations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Overview */}
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border/50 rounded-lg">
              <h3 className="font-bold text-lg text-foreground mb-4">Key Principles</h3>
              <ul className="space-y-3">
                {[
                  'Minimum 3 independent reviewers per paper',
                  'Strict conflict-of-interest management',
                  'Double-blind review methodology',
                  'Rigorous evaluation criteria applied',
                  'Fair and transparent process',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-foreground">
                    <span className="text-primary font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
              <h3 className="font-bold text-lg text-foreground mb-4">
                Evaluation Criteria
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">1.</span>
                  <span>Novelty and originality</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">2.</span>
                  <span>Technical soundness</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">3.</span>
                  <span>Significance and impact</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">4.</span>
                  <span>Clarity of presentation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">5.</span>
                  <span>Relevance to conference</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Accordion Details */}
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                Submission & Initial Check
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>
                  Upon submission, papers undergo an initial desk review to verify they meet
                  basic requirements (format, length, scope).
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Format compliance verification</li>
                  <li>Plagiarism screening initiated</li>
                  <li>Scope relevance assessment</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                Reviewer Assignment
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>
                  Papers are assigned to 3+ expert reviewers based on their expertise and
                  conflict-of-interest declarations.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Expertise matching algorithm used</li>
                  <li>COI declarations reviewed</li>
                  <li>Geographically diverse reviewers</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                Review & Plagiarism Screening
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>
                  Concurrent with peer review, papers are screened for plagiarism using
                  iThenticate or similar tools.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Detailed review reports provided</li>
                  <li>iThenticate plagiarism check</li>
                  <li>Constructive feedback given</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                Decision & Camera-Ready
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>
                  After reviews are compiled, a decision is made. Accepted papers must address
                  reviewer comments.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Meta-review by area chairs</li>
                  <li>Revision requests for accepted papers</li>
                  <li>Response to all reviewer comments</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="font-bold text-foreground hover:text-primary transition-colors">
                Publication & Proceedings
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 space-y-2">
                <p>
                  Final papers are compiled into Springer LNCS proceedings, subject to
                  Springer&apos;s editorial approval.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Springer LNCS format compliance</li>
                  <li>Copyright agreements signed</li>
                  <li>Online and print publication</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
