'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'

gsap.registerPlugin(ScrollTrigger)

const topics = [
  'NLP & Text Mining',
  'Information Extraction',
  'Transformers & LLMs',
  'RAG Pipelines',
  'Question Answering',
  'Conversational AI',
  'Dialogue Systems',
  'Speech Understanding',
  'Multimodal NLP',
  'Information Retrieval',
  'Semantic Search',
  'Knowledge Graphs',
  'Multilingual NLP',
  'Low-Resource NLP',
  'Arabic & Amazigh',
  'Explainable AI',
  'Trustworthy NLP',
  'Bias Mitigation',
]

export default function Topics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(badgesRef.current.filter((b) => b !== null), {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgesRef.current.filter((b) => b !== null),
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
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
      id="topics"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Topics of Interest
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Non-exhaustive list of research areas and topics we welcome at IANLP 2026
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {topics.map((topic, index) => (
            <div
              key={topic}
              ref={(el) => {
                badgesRef.current[index] = el
              }}
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium hover:bg-primary/80 hover:text-white transition-colors cursor-default"
              >
                {topic}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Special Focus Areas
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-primary mb-2">Core NLP Tasks</p>
              <p className="text-muted-foreground text-sm">
                Classification, Named Entity Recognition, Parsing, Summarization,
                Machine Translation
              </p>
            </div>
            <div>
              <p className="font-semibold text-accent mb-2">Advanced Models</p>
              <p className="text-muted-foreground text-sm">
                LLMs, Transformers, Prompting, Instruction Tuning, Semantic Search
              </p>
            </div>
            <div>
              <p className="font-semibold text-secondary mb-2">Trustworthy AI</p>
              <p className="text-muted-foreground text-sm">
                Evaluation, Robustness, Bias Detection, Fairness, Explainability
              </p>
            </div>
            <div>
              <p className="font-semibold text-primary mb-2">Real-World Apps</p>
              <p className="text-muted-foreground text-sm">
                Education, Healthcare, Legal Tech, Finance, Industry Applications
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
