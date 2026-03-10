import React from "react"
import type { Metadata } from 'next'
import { Aldrich } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const aldrich = Aldrich({
  subsets: ["latin"],
  variable: "--font-aldrich",
  weight: "400",
});

export const metadata: Metadata = {
  title: 'IANLP 2026 - 1st International Conference on AI for NLP',
  description: 'IANLP 2026: 1st International Conference on Artificial Intelligence for Natural Language Processing. June 26-27, 2026 in Casablanca, Morocco.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning className={aldrich.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
