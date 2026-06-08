import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/ianlp/navbar'
import RegisterPageHero from '@/components/ianlp/register-page-hero'
import Register from '@/components/ianlp/register'
import Footer from '@/components/ianlp/footer'
import {
  getContactForLocale,
  getPricingForLocale,
  getRegisterPageContentForLocale,
  getWorkshopsForLocale,
} from '@/lib/data/content'
import type { Locale } from '@/types/database'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const pageContent = await getRegisterPageContentForLocale(locale as Locale)

  return {
    title: `${pageContent.pageTitle} | IANLP 2026`,
    description: pageContent.pageSubtitle,
  }
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [pricing, workshops, pageContent, contact] = await Promise.all([
    getPricingForLocale(locale as Locale),
    getWorkshopsForLocale(locale as Locale),
    getRegisterPageContentForLocale(locale as Locale),
    getContactForLocale(locale as Locale),
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <RegisterPageHero pageContent={pageContent} />
        <Register
          tiers={pricing}
          workshops={workshops}
          pageContent={pageContent}
          showHeader={false}
          variant="page"
        />
      </main>
      <Footer contact={contact} />
    </div>
  )
}
