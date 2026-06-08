import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/ianlp/navbar'
import Hero from '@/components/ianlp/hero'
import ImportantDates from '@/components/ianlp/important-dates'
import QuickLinks from '@/components/ianlp/quick-links'
import KeynoteSpeakers from '@/components/ianlp/keynote-speakers'
import Topics from '@/components/ianlp/topics'
import CFPSection from '@/components/ianlp/cfp-section'
import Submission from '@/components/ianlp/submission'
import ReviewProcess from '@/components/ianlp/review-process'
import Committees from '@/components/ianlp/committees'
import VenueTravel from '@/components/ianlp/venue-travel'
import Contact from '@/components/ianlp/contact'
import Footer from '@/components/ianlp/footer'
import { getCommitteesForLocale, getContactForLocale, getDatesForLocale, getPartnersForLocale, getSpeakersForLocale, getTopicsForLocale } from '@/lib/data/content'
import type { Locale } from '@/types/database'

export const metadata: Metadata = {
  title: 'IANLP 2026 - 1st International Conference on AI for NLP',
  description: 'IANLP 2026: International Conference on Artificial Intelligence for Natural Language Processing. June 26-27, 2026 in Casablanca, Morocco.',
}

type Props = { params: Promise<{ locale: string }> }

export default async function IANLPPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [speakers, partners, dates, topics, committees, contact] = await Promise.all([
    getSpeakersForLocale(locale as Locale),
    getPartnersForLocale(locale as Locale),
    getDatesForLocale(locale as Locale),
    getTopicsForLocale(locale as Locale),
    getCommitteesForLocale(locale as Locale),
    getContactForLocale(locale as Locale),
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ImportantDates dates={dates} />
        <QuickLinks />
        <KeynoteSpeakers speakers={speakers} />
        <Topics mainTopics={topics.mainTopics} focusAreas={topics.focusAreas} />
        <CFPSection />
        <Submission />
        <ReviewProcess />
        <Committees
          pcChairs={committees.pcChairs}
          reviewers={committees.reviewers}
          organizing={committees.organizing}
        />
        <VenueTravel />
        <Contact partners={partners} contact={contact} />
      </main>
      <Footer contact={contact} />
    </div>
  )
}
