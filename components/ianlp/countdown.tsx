'use client'

import { Fragment, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const CONFERENCE_DATE = new Date('2026-06-29T09:00:00')

function getTimeLeft() {
  const now = new Date()
  const diff = CONFERENCE_DATE.getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

type CountdownProps = {
  variant?: 'hero' | 'default'
}

export default function Countdown({ variant = 'default' }: CountdownProps) {
  const t = useTranslations('countdown')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const heroBlocks = [
    { value: timeLeft.days, label: t('days'), pad: false },
    { value: timeLeft.hours, label: t('hours'), pad: true },
    { value: timeLeft.minutes, label: t('minutesShort'), pad: true },
    { value: timeLeft.seconds, label: t('secondsShort'), pad: true },
  ]

  const defaultBlocks = [
    { value: timeLeft.days, label: t('days'), pad: false },
    { value: timeLeft.hours, label: t('hours'), pad: true },
    { value: timeLeft.minutes, label: t('minutes'), pad: true },
    { value: timeLeft.seconds, label: t('seconds'), pad: true },
  ]

  const formatValue = (value: number, pad: boolean) =>
    pad ? String(value).padStart(2, '0') : String(value)

  if (variant === 'hero') {
    return (
      <div
        className="countdown-hero w-full"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        aria-label={t('timeRemaining')}
      >
        <p className="countdown-hero-label">{t('timeRemaining')}</p>

        <div className="flex items-start justify-center">
          {heroBlocks.map((block, index) => (
            <Fragment key={block.label}>
              {index > 0 && (
                <span className="countdown-hero-separator mx-2 sm:mx-4 md:mx-6 lg:mx-8" aria-hidden>
                  :
                </span>
              )}
              <div className="flex min-w-[3rem] flex-col items-center px-1 text-center sm:min-w-[4rem] sm:px-2 md:min-w-[5rem] md:px-3">
                <span className="countdown-hero-value tabular-nums">
                  {formatValue(block.value, block.pad)}
                </span>
                <span className="countdown-hero-unit">{block.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <p className="section-label">{t('timeRemaining')}</p>
      <div className="flex flex-wrap items-start justify-center gap-y-4">
        {defaultBlocks.map((block, index) => (
          <Fragment key={block.label}>
            {index > 0 && (
              <span className="countdown-separator mx-3 sm:mx-5 md:mx-6" aria-hidden>
                :
              </span>
            )}
            <div className="min-w-[90px] rounded-2xl border border-border bg-white px-5 py-4 shadow-sm sm:min-w-[110px]">
              <p className="text-2xl font-bold text-primary tabular-nums md:text-4xl">
                {formatValue(block.value, block.pad)}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{block.label}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
