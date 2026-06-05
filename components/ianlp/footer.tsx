'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = [
  { labelKey: 'callForPapers', href: '#cfp' },
  { labelKey: 'importantDates', href: '#dates' },
  { labelKey: 'submission', href: '#submission' },
  { labelKey: 'committees', href: '#committees' },
  { labelKey: 'venue', href: '#venue' },
  { labelKey: 'contact', href: '#contact' },
] as const

const legalLinks = [
  { labelKey: 'privacyPolicy', href: '#contact' },
  { labelKey: 'termsOfUse', href: '#contact' },
  { labelKey: 'codeOfConduct', href: '#contact' },
] as const

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const currentYear = new Date().getFullYear()

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Image
              src="/ianlp-logo.png"
              alt="IANLP 2026"
              width={200}
              height={60}
              className="mb-6 h-12 w-auto brightness-0 invert"
            />
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              {t('aboutTitle')}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-white/70">{t('aboutDesc')}</p>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              {t('quickLinks')}
            </p>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }}
                    className="group inline-flex cursor-pointer items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                  >
                    {link.labelKey === 'venue' || link.labelKey === 'contact'
                      ? tNav(link.labelKey)
                      : t(link.labelKey)}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              {t('contact')}
            </p>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="mailto:omar.zahour@univh2c.ma"
                  className="group flex cursor-pointer items-start gap-3 text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                >
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" aria-hidden />
                  <span>omar.zahour@univh2c.ma</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+212660082091"
                  className="group flex cursor-pointer items-start gap-3 text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                >
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" aria-hidden />
                  <span>+212 6 60 08 20 91</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" aria-hidden />
                <span className="leading-relaxed">{t('organizedByAddress')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
              {t('organizedBy')}
            </p>
            <p className="text-sm leading-relaxed text-white/70">{t('organizedByValue')}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
              {t('publication')}
            </p>
            <p className="text-sm font-medium text-white/90">{t('publicationValue')}</p>
            <p className="mt-1 text-sm leading-relaxed text-white/70">{t('publicationNote')}</p>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
              {t('sponsors')}
            </p>
            <p className="text-sm leading-relaxed text-white/70">{t('sponsorsValue')}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-white/50">
            © {currentYear} IANLP 2026 — {t('copyright')}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="cursor-pointer text-xs text-white/50 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>

          <p className="text-xs italic text-white/40">{tCommon('disclaimerLncs')}</p>
        </div>
      </div>
    </footer>
  )
}
