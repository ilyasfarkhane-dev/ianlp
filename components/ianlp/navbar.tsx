'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './language-switcher'

const EASYCHAIR_SUBMIT_URL =
  'https://easychair.org/conferences/?conf=ianlp2026'

const LNCS_GUIDELINES_URL =
  'https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines'

const navLinks = [
  { labelKey: 'overview', href: '#overview' },
  { labelKey: 'program', href: '#program' },
  { labelKey: 'topics', href: '#topics' },
  { labelKey: 'cfp', href: '#cfp' },
  { labelKey: 'dates', href: '#dates' },
  { labelKey: 'submission', href: '#submission' },
  { labelKey: 'review', href: '#review' },
  { labelKey: 'committees', href: '#committees' },
  { labelKey: 'venue', href: '#venue' },
  { labelKey: 'contact', href: '#contact' },
] as const

export default function Navbar() {
  const t = useTranslations('nav')
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [onHero, setOnHero] = useState(true)

  const isHomePage = pathname === '/ianlp'
  const isRegisterPage = pathname === '/ianlp/register'
  const isSubPage = !isHomePage

  useEffect(() => {
    if (isSubPage) {
      setOnHero(false)
      return
    }

    const onScroll = () => setOnHero(window.scrollY < 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isSubPage])

  const handleNavClick = (href: string) => {
    if (!href.startsWith('#')) return

    const target = document.querySelector(href)
    if (!target) {
      router.push(`/ianlp${href}`)
      setIsOpen(false)
      return
    }

    target.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  const handleLogoClick = () => {
    if (isSubPage) {
      router.push('/ianlp')
      setIsOpen(false)
      return
    }

    handleNavClick('#overview')
  }

  const lightNav = !onHero

  const navLinkClass = (extra = '') =>
    `px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-lg ${
      lightNav
        ? 'text-muted-foreground hover:text-primary hover:bg-primary/5'
        : 'text-white/70 hover:text-white hover:bg-white/10'
    } ${extra}`

  const mobileNavLinkClass =
    'block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ' +
    (lightNav
      ? 'text-muted-foreground hover:text-primary hover:bg-primary/5'
      : 'text-white/80 hover:text-white hover:bg-white/10')

  return (
    <nav className={`nav-glass ${lightNav ? 'nav-glass-scrolled' : ''}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="IANLP 2026"
        >
          <Image
            src="/ianlp-logo.png"
            alt="IANLP 2026"
            width={400}
            height={120}
            className={`h-12 w-auto min-w-[120px] object-contain sm:h-14 sm:min-w-[160px] transition-all duration-300 ${
              lightNav ? '' : 'brightness-0 invert'
            }`}
            priority
          />
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className={navLinkClass()}
            >
              {t(link.labelKey)}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isRegisterPage ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className={`cursor-pointer rounded-full px-5 py-2 h-auto text-sm ${
                lightNav
                  ? 'border-primary/30 text-primary hover:bg-primary/5 hover:text-primary'
                  : 'border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white'
              }`}
            >
              <Link href="/ianlp/register">{t('register')}</Link>
            </Button>
          ) : null}
          <Button
            asChild
            size="sm"
            className="btn-primary rounded-full px-6 py-2 h-auto text-sm border-0"
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

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher variant={lightNav ? 'light' : 'dark'} />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
              lightNav ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
            }`}
            aria-label={t('toggleMenu')}
          >
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
              Menu
            </span>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className={`lg:hidden nav-glass-menu ${lightNav ? 'nav-glass-menu-scrolled' : ''}`}>
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className={mobileNavLinkClass}
              >
                {t(link.labelKey)}
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {!isRegisterPage ? (
                <Button asChild variant="outline" className="w-full cursor-pointer rounded-full" size="sm">
                  <Link href="/ianlp/register" onClick={() => setIsOpen(false)}>
                    {t('register')}
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" className="w-full cursor-pointer" size="sm">
                <a href={LNCS_GUIDELINES_URL} target="_blank" rel="noopener noreferrer">
                  {t('lncsTemplate')}
                </a>
              </Button>
              <Button asChild className="w-full btn-primary border-0 rounded-full" size="sm">
                <a href={EASYCHAIR_SUBMIT_URL} target="_blank" rel="noopener noreferrer">
                  {t('submitPaper')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
