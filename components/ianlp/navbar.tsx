'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Topics', href: '#topics' },
  { label: 'CFP', href: '#cfp' },
  { label: 'Dates', href: '#dates' },
  { label: 'Submission', href: '#submission' },
  { label: 'Review', href: '#review' },
  { label: 'Committees', href: '#committees' },
  { label: 'Venue', href: '#venue' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
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
        if (self.getVelocity() > 500 || self.getMomentum() > 0.5) {
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
      className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-sm transition-all duration-300"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
        
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-[#002bb8]">IANLP 2026</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            disabled
            variant="outline"
            size="sm"
            title="Coming soon"
          >
            LNCS Template
          </Button>
          <Button
            disabled
            size="sm"
            className="bg-[#002bb8] text-white"
            title="Coming soon"
          >
            Submit Paper
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                disabled
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
                title="Coming soon"
              >
                LNCS Template
              </Button>
              <Button
                disabled
                className="w-full bg-[#002bb8] text-white"
                size="sm"
                title="Coming soon"
              >
                Submit Paper
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
