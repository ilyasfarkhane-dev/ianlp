'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type AgendaItem = {
  labelKey: string
  dateKey: string
  descKey: string
  showDesc?: boolean
}

const tabAgendas: AgendaItem[][] = [
  [
    {
      labelKey: 'paperDeadline',
      dateKey: 'paperDate',
      descKey: 'paperDesc',
      showDesc: true,
    },
  ],
  [
    {
      labelKey: 'notification',
      dateKey: 'notificationDate',
      descKey: 'notificationDesc',
      showDesc: true,
    },
    {
      labelKey: 'cameraReady',
      dateKey: 'cameraReadyDate',
      descKey: 'cameraReadyDesc',
    },
  ],
  [
    {
      labelKey: 'conferenceDates',
      dateKey: 'conferenceDate',
      descKey: 'conferenceDesc',
      showDesc: true,
    },
  ],
]

export default function ImportantDates() {
  const t = useTranslations('dates')
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const tabs = [
    { id: 0, label: t('tabSubmission'), date: t('paperDate') },
    { id: 1, label: t('tabReview'), date: t('tabReviewDate') },
    { id: 2, label: t('tabConference'), date: t('conferenceDate') },
  ]

  const visibleItems = tabAgendas[activeTab] ?? tabAgendas[0]

  return (
    <section
      ref={sectionRef}
      id="dates"
      className="bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-42"
    >
      <div ref={contentRef} className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Left — intro + images */}
          <div>
            <p className="section-label">{t('label')}</p>
            <h2 className="section-heading">{t('title')}</h2>
            <p className="section-subheading mb-6 max-w-md">{t('subtitle')}</p>

            <a
              href="#cfp"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-200 hover:gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              {t('learnMore')}
              <ArrowRight className="h-4 w-4" />
            </a>

          
          </div>

          {/* Right — tabs + agenda */}
          <div>
            <div
              className="mb-8 flex gap-6 border-b border-border sm:gap-10"
              role="tablist"
              aria-label={t('label')}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative cursor-pointer pb-4 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                    activeTab === tab.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block text-sm font-semibold sm:text-base">{tab.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{tab.date}</span>
                  {activeTab === tab.id && (
                    <span
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
                      aria-hidden
                    />
                  )}
                </button>
              ))}
            </div>

            <div role="tabpanel" className="space-y-0">
              {visibleItems.map((item, index) => (
                <div
                  key={item.labelKey}
                  className={`flex gap-6 sm:gap-10 py-6 ${
                    index !== visibleItems.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <p className="w-28 flex-shrink-0 text-sm font-bold text-muted-foreground sm:w-32 sm:text-base">
                    {t(item.dateKey)}
                  </p>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{t(item.labelKey)}</p>
                    {item.showDesc && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {t(item.descKey)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
