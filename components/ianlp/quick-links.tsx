'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { FileText, Users, Calendar, Send } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const links = [
  {
    icon: FileText,
    label: 'Call for Papers',
    href: '#cfp',
    color: 'from-primary',
  },
  {
    icon: Calendar,
    label: 'Important Dates',
    href: '#dates',
    color: 'from-accent',
  },
  {
    icon: Send,
    label: 'Submit Paper',
    href: '#submission',
    color: 'from-secondary',
  },
  {
    icon: Users,
    label: 'Committees',
    href: '#committees',
    color: 'from-primary',
  },
]

export default function QuickLinks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(buttonsRef.current, { opacity: 1, scale: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttonsRef.current.filter((btn) => btn !== null),
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={containerRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Quick Links</h2>
          <p className="text-muted-foreground">Navigate to key conference sections</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map((link, index) => {
            const Icon = link.icon
            return (
              <button
                key={link.label}
                ref={(el) => {
                  buttonsRef.current[index] = el
                }}
                onClick={() => handleClick(link.href)}
                className="group p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:bg-card/80 transition-all hover:shadow-md"
              >
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${link.color} to-accent/50 text-white flex items-center justify-center mb-3 group-hover:shadow-lg transition-all`}>
                  <Icon size={20} />
                </div>
                <p className="font-semibold text-foreground text-left">
                  {link.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
