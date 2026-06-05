'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Gavel,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const accordionKeys: {
  title: string
  desc: string
  items: string[]
  icon: LucideIcon
}[] = [
  {
    title: 'accordion1Title',
    desc: 'accordion1Desc',
    items: ['accordion1a', 'accordion1b', 'accordion1c'],
    icon: ClipboardCheck,
  },
  {
    title: 'accordion2Title',
    desc: 'accordion2Desc',
    items: ['accordion2a', 'accordion2b', 'accordion2c'],
    icon: Users,
  },
  {
    title: 'accordion3Title',
    desc: 'accordion3Desc',
    items: ['accordion3a', 'accordion3b', 'accordion3c'],
    icon: ShieldCheck,
  },
  {
    title: 'accordion4Title',
    desc: 'accordion4Desc',
    items: ['accordion4a', 'accordion4b', 'accordion4c'],
    icon: Gavel,
  },
  {
    title: 'accordion5Title',
    desc: 'accordion5Desc',
    items: ['accordion5a', 'accordion5b', 'accordion5c'],
    icon: BookOpen,
  },
]

export default function ReviewProcess() {
  const t = useTranslations('review')
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

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
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
          }
        )
      }

      if (accordionRef.current) {
        const items = accordionRef.current.querySelectorAll('[data-slot="accordion-item"]')
        gsap.fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: { trigger: accordionRef.current, start: 'top 85%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="review" className="section-dark">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div ref={introRef}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              {t('label')}
            </p>
            <h2 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t('faqTitle')}
            </h2>
            <p className="mb-8 max-w-md leading-relaxed text-white/70">{t('subtitle')}</p>

            <a
              href="#contact"
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-secondary transition-all duration-200 hover:gap-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary rounded-sm"
            >
              {t('haveQuestion')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>

          <div ref={accordionRef}>
            <Accordion type="single" collapsible className="divide-y divide-white/10">
              {accordionKeys.map((item, i) => {
                const Icon = item.icon
                const step = String(i + 1).padStart(2, '0')

                return (
                  <AccordionItem
                    key={item.title}
                    value={`item-${i}`}
                    className="group border-0 px-0 transition-colors duration-200 data-[state=open]:bg-white/[0.04]"
                  >
                    <AccordionTrigger className="cursor-pointer gap-4 py-5 text-left hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary [&>svg]:text-white/50 group-hover:[&>svg]:text-secondary">
                      <span className="flex min-w-0 flex-1 items-start gap-4 px-5">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-secondary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 pt-1">
                         
                          <span className="block text-base font-semibold text-white sm:text-lg">
                            {t(item.title)}
                          </span>
                        </span>
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="pb-5 pl-14 text-white/75">
                      <p className="leading-relaxed">{t(item.desc)}</p>
                      <ul className="mt-4 space-y-2.5">
                        {item.items.map((key) => (
                          <li key={key} className="flex items-start gap-2.5 text-sm leading-relaxed">
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary"
                              aria-hidden
                            />
                            <span>{t(key)}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
