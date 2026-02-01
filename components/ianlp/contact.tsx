'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '@/components/ui/card'
import { Mail, Phone, MapPin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set([headingRef.current, contactRef.current], { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        contactRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? Contact the IANLP 2026 organizing committee
          </p>
        </div>

        <div
          ref={contactRef}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-8 border border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Email</p>
                  <a
                    href="mailto:omar.zahour@univh2c.ma"
                    className="text-primary hover:underline font-semibold"
                  >
                    omar.zahour@univh2c.ma
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-secondary text-white flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Phone</p>
                  <a
                    href="tel:+212660082091"
                    className="text-accent hover:underline font-semibold"
                  >
                    +212 6 60 08 20 91
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary to-primary text-white flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Address</p>
                  <p className="text-foreground/80">
                    Faculty of Sciences Ben M'Sick (FSBM)<br />
                    Hassan II University of Casablanca<br />
                    Bd Commandant Driss Al Harti<br />
                    Casablanca 20670, Morocco
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Details Card */}
          <Card className="p-8 border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              General Chair
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Name
                </p>
                <p className="text-xl font-bold text-foreground">
                  Prof. Omar Zahour
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Affiliation
                </p>
                <p className="text-foreground font-semibold">
                  Faculty of Sciences Ben M'Sick (FSBM)
                </p>
                <p className="text-foreground/80">
                  Hassan II University of Casablanca
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Contact
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Email:</strong>{' '}
                    <a
                      href="mailto:omar.zahour@univh2c.ma"
                      className="text-primary hover:underline"
                    >
                      omar.zahour@univh2c.ma
                    </a>
                  </p>
                  <p className="text-foreground">
                    <strong>Phone:</strong>{' '}
                    <a
                      href="tel:+212660082091"
                      className="text-primary hover:underline"
                    >
                      +212 6 60 08 20 91
                    </a>
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-foreground/70 italic">
                  Feel free to reach out with any questions about IANLP 2026,
                  submissions, or conference logistics.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
