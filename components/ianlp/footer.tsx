'use client'

import { useTranslations } from 'next-intl'
import { Separator } from '@/components/ui/separator'

const footerLinks = [
  { labelKey: 'callForPapers', href: '#cfp' },
  { labelKey: 'importantDates', href: '#dates' },
  { labelKey: 'submission', href: '#submission' },
  { labelKey: 'committees', href: '#committees' },
]

export default function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">{t('aboutTitle')}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {t('aboutDesc')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">{t('contact')}</h3>
            <div className="space-y-2 text-sm text-foreground/70">
              <p>
                <strong className="text-foreground">{t('email')}:</strong>
                <br />
                <a
                  href="mailto:omar.zahour@univh2c.ma"
                  className="text-primary hover:underline"
                >
                  omar.zahour@univh2c.ma
                </a>
              </p>
              <p>
                <strong className="text-foreground">{t('phone')}:</strong>
                <br />
                <a
                  href="tel:+212660082091"
                  className="text-primary hover:underline"
                >
                  +212 6 60 08 20 91
                </a>
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
          <div>
            <p className="font-semibold text-foreground mb-2">{t('organizedBy')}</p>
            <p>{t('organizedByValue')}</p>
            <p className="mt-1">{t('organizedByAddress')}</p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-2">{t('publication')}</p>
            <p>{t('publicationValue')}</p>
            <p className="mt-1">{t('publicationNote')}</p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-foreground/60">
          <p>
            © {currentYear} IANLP 2026 – {t('copyright')}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">
              {t('privacyPolicy')}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {t('termsOfUse')}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {t('codeOfConduct')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
