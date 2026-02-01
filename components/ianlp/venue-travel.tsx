'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '@/components/ui/card'
import { MapPin, Plane, Hotel, Info } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function VenueTravel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set([headingRef.current, ...cardsRef.current.filter((c) => c !== null)], {
        opacity: 1,
        y: 0,
      })
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
        cardsRef.current.filter((c) => c !== null),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
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
      id="venue"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Venue & Travel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Information about our conference location and travel arrangements
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Venue Card */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el
            }}
          >
            <Card className="p-8 h-full border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-[#002bb8] text-white flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Venue</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Host Institution
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    Faculty of Sciences Ben M'Sick (FSBM)
                  </p>
                  <p className="text-foreground/80 mt-1">
                    Hassan II University of Casablanca
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-foreground">
                    Bd Commandant Driss Al Harti<br />
                    Casablanca 20670, Morocco
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    About Casablanca
                  </p>
                  <p className="text-foreground/80">
                    Morocco's largest city and economic hub, known for its modern
                    architecture, vibrant culture, and rich history.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Travel Info */}
          <div className="space-y-6">
            <div
              ref={(el) => {
                cardsRef.current[1] = el
              }}
            >
              <Card className="p-6 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Plane size={20} />
                  </div>
                  <h4 className="font-bold text-foreground">Getting There</h4>
                </div>
                <p className="text-foreground/80 text-sm">
                  Casablanca is well connected through <strong>Mohammed V International
                  Airport (CMN)</strong>, located approximately 30km south of the city center.
                  Regular flights connect to major European and international hubs.
                </p>
              </Card>
            </div>

            <div
              ref={(el) => {
                cardsRef.current[2] = el
              }}
            >
              <Card className="p-6 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                    <Hotel size={20} />
                  </div>
                  <h4 className="font-bold text-foreground">Accommodation</h4>
                </div>
                <p className="text-foreground/80 text-sm">
                  Casablanca offers a wide range of hotels and accommodations. Additional
                  information about recommended venues and special conference rates will be
                  announced soon.
                </p>
              </Card>
            </div>

            <div
              ref={(el) => {
                cardsRef.current[3] = el
              }}
            >
              <Card className="p-6 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  <h4 className="font-bold text-foreground">More Information</h4>
                </div>
                <p className="text-foreground/80 text-sm">
                  Detailed travel guides, visa requirements, local attractions, and
                  dining recommendations will be provided in the conference portal.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <Card className="p-8 border border-border/50 bg-[#002bb8]/5 overflow-hidden">
          <div className="relative bg-muted rounded-lg overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <p className="text-lg font-semibold text-foreground mb-2">
                Conference Map & Venue Details
              </p>
              <p className="text-muted-foreground text-sm max-w-md">
                Interactive map and detailed venue information coming soon. Maps and
                directions will be available in the conference registration portal.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
