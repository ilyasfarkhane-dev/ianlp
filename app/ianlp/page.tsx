import { Metadata } from 'next'
import Navbar from '@/components/ianlp/navbar'
import Hero from '@/components/ianlp/hero'
import QuickLinks from '@/components/ianlp/quick-links'
import Topics from '@/components/ianlp/topics'
import CFPSection from '@/components/ianlp/cfp-section'
import ImportantDates from '@/components/ianlp/important-dates'
import Submission from '@/components/ianlp/submission'
import ReviewProcess from '@/components/ianlp/review-process'
import Committees from '@/components/ianlp/committees'
import KeynoteSpeakers from '@/components/ianlp/keynote-speakers'
import VenueTravel from '@/components/ianlp/venue-travel'
import Contact from '@/components/ianlp/contact'
import Footer from '@/components/ianlp/footer'

export const metadata: Metadata = {
  title: 'IANLP 2026 - 1st International Conference on AI for NLP',
  description: 'IANLP 2026: International Conference on Artificial Intelligence for Natural Language Processing. June 26-27, 2026 in Casablanca, Morocco.',
}

export default function IANLPPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative">
        <Hero />
        <QuickLinks />
        <Topics />
        <CFPSection />
        <ImportantDates />
        <Submission />
        <ReviewProcess />
        <Committees />
        <KeynoteSpeakers />
        <VenueTravel />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
