'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Reveal } from './motion-primitives'

const reviews = [
  {
    quote:
      'The turf and floodlights are genuinely professional. We shifted our entire weekend league here and never looked back.',
    name: 'Hamza Tariq',
    role: 'Captain, Enclave Strikers',
  },
  {
    quote:
      'Booking took 30 seconds and the confirmation was instant. The lounge and parking make it easy to bring the whole crew.',
    name: 'Bilal Ahmed',
    role: 'Corporate League Organiser',
  },
  {
    quote:
      'My kids train at the academy here every week. Safe, enclosed, and the coaching setup is top class.',
    name: 'Sana Malik',
    role: 'Parent & Member',
  },
  {
    quote:
      'Hosted our company gala tournament — branding, catering, recording, all sorted by their team. Flawless night.',
    name: 'Usman Raza',
    role: 'HR Lead, TechNova',
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const go = useCallback(
    (d: number) => {
      setDir(d)
      setIndex((i) => (i + d + reviews.length) % reviews.length)
    },
    [],
  )

  useEffect(() => {
    const t = setInterval(() => go(1), 6000)
    return () => clearInterval(t)
  }, [go])

  const r = reviews[index]

  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_50%,oklch(0.86_0.18_96/0.08),transparent_70%)]" />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            What players say
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <Quote className="mx-auto mb-6 h-10 w-10 text-primary" />
        </Reveal>

        <div className="relative min-h-52">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-balance font-display text-2xl font-medium leading-snug sm:text-3xl">
                “{r.quote}”
              </p>
              <div className="mt-6">
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="grid h-10 w-10 place-items-center rounded-full glass transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to review ${i + 1}`}
                onClick={() => {
                  setDir(i > index ? 1 : -1)
                  setIndex(i)
                }}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-primary' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next review"
            className="grid h-10 w-10 place-items-center rounded-full glass transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
