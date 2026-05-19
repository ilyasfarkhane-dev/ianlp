'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './language-switcher'

gsap.registerPlugin(ScrollTrigger)

const EASYCHAIR_SUBMIT_URL =
  'https://easychair.org/conferences/?conf=ianlp2026'

const navLinks = [
  { labelKey: 'overview', href: '#overview' },
  { labelKey: 'topics', href: '#topics' },
  { labelKey: 'cfp', href: '#cfp' },
  { labelKey: 'dates', href: '#dates' },
  { labelKey: 'submission', href: '#submission' },
  { labelKey: 'review', href: '#review' },
  { labelKey: 'committees', href: '#committees' },
  { labelKey: 'venue', href: '#venue' },
  { labelKey: 'contact', href: '#contact' },
]

export default function Navbar() {
  const t = useTranslations('nav')
  const navRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(navRef.current, { className: '+=blur-active' })
      return
    }

    ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = typeof self.getVelocity === 'function' ? self.getVelocity() : 0
        if (velocity > 500) {
          gsap.to(navRef.current, { className: '+=blur-active' })
        } else {
          gsap.to(navRef.current, { className: '-=blur-active' })
        }
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-md transition-all duration-300"
    >
      <div className="mx-auto flex max-w-9xl items-center justify-between px-4 py-3  ">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('#overview')}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label="IANLP 2026"
          >
            <Image
              src="/ianlp-logo.png"
              alt="IANLP 2026"
              width={400}
              height={120}
              className="h-20 w-auto min-w-[200px] object-contain sm:h-28 sm:min-w-[280px]"
              priority
            />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {t(link.labelKey)}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            disabled
            variant="outline"
            size="sm"
            title={t('comingSoon')}
          >
            {t('lncsTemplate')}
          </Button>
          <Button
            asChild
            size="sm"
            className="btn-gradient text-white border-0"
          >
            <a
              href={EASYCHAIR_SUBMIT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('submitPaper')}
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label={t('toggleMenu')}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {t(link.labelKey)}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                disabled
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
                title={t('comingSoon')}
              >
                {t('lncsTemplate')}
              </Button>
              <Button
                asChild
                className="w-full btn-gradient text-white border-0"
                size="sm"
              >
                <a
                  href={EASYCHAIR_SUBMIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('submitPaper')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
