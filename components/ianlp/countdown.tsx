'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const CONFERENCE_DATE = new Date('2026-06-26T09:00:00')

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

export default function Countdown() {
  const t = useTranslations('countdown')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const blocks = [
    { value: timeLeft.days, label: t('days') },
    { value: timeLeft.hours, label: t('hours') },
    { value: timeLeft.minutes, label: t('minutes') },
    { value: timeLeft.seconds, label: t('seconds') },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {blocks.map((block) => (
        <div
          key={block.label}
          className="min-w-[100px] rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm"
        >
          <p className="text-2xl font-bold text-white md:text-3xl">
            {String(block.value).padStart(2, '0')}
          </p>
          <p className="text-sm font-medium text-white/70">{block.label}</p>
        </div>
      ))}
    </div>
  )
}
