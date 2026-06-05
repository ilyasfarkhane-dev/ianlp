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
import Pricing from '@/components/ianlp/pricing'
import Contact from '@/components/ianlp/contact'
import Footer from '@/components/ianlp/footer'

export const metadata: Metadata = {
  title: 'IANLP 2026 - 1st International Conference on AI for NLP',
  description: 'IANLP 2026: International Conference on Artificial Intelligence for Natural Language Processing. June 26-27, 2026 in Casablanca, Morocco.',
}

type Props = { params: Promise<{ locale: string }> }

export default async function IANLPPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ImportantDates />
        <QuickLinks />
        <KeynoteSpeakers />
        <Topics />
        <CFPSection />
        <Submission />
        <ReviewProcess />
        <Committees />
        <VenueTravel />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
