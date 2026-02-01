import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div>
          <h1 className="text-5xl font-bold text-foreground mb-2">IANLP 2026</h1>
          <p className="text-2xl text-primary font-semibold">
            1st International Conference on AI for Natural Language Processing
          </p>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Join us on June 26-27, 2026 in Casablanca, Morocco for the inaugural
          IANLP conference, bringing together researchers and practitioners in
          Artificial Intelligence and Natural Language Processing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/ianlp">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white">
              Explore Conference
            </Button>
          </Link>
          <Link href="/ianlp#cfp">
            <Button size="lg" variant="outline">
              Call for Papers
            </Button>
          </Link>
        </div>

        <div className="pt-8 grid sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Dates</p>
            <p className="font-bold text-foreground">26–27 June 2026</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-bold text-foreground">Casablanca, Morocco</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Publication</p>
            <p className="font-bold text-foreground">Springer LNCS</p>
          </div>
        </div>
      </div>
    </main>
  )
}
