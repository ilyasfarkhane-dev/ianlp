'use client'

import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">About IANLP</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              IANLP 2026 is the first edition of an international conference dedicated to
              Artificial Intelligence for Natural Language Processing. We bring together
              researchers and practitioners to share advances in cutting-edge NLP technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Call for Papers', href: '#cfp' },
                { label: 'Important Dates', href: '#dates' },
                { label: 'Submission', href: '#submission' },
                { label: 'Committees', href: '#committees' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-foreground/70">
              <p>
                <strong className="text-foreground">Email:</strong>
                <br />
                <a
                  href="mailto:omar.zahour@univh2c.ma"
                  className="text-primary hover:underline"
                >
                  omar.zahour@univh2c.ma
                </a>
              </p>
              <p>
                <strong className="text-foreground">Phone:</strong>
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
            <p className="font-semibold text-foreground mb-2">Organized By</p>
            <p>AM2I & FSBM – Hassan II University of Casablanca</p>
            <p className="mt-1">
              Bd Commandant Driss Al Harti, Casablanca 20670, Morocco
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-2">Publication</p>
            <p>Springer LNCS (Proposed)</p>
            <p className="mt-1">
              Subject to Springer&apos;s editorial approval and LNCS standards compliance
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-foreground/60">
          <p>
            © {currentYear} IANLP 2026 – 1st International Conference on AI for Natural
            Language Processing
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Code of Conduct
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
