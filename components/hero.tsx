'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, PlayCircle, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { Counter } from './motion-primitives'

const stats = [
  { to: 50000, suffix: ' sq ft', label: 'Enclosed arena' },
  { to: 12, suffix: ' hr', label: 'Daily operations' },
  { to: 500, suffix: '+', label: 'Matches hosted' },
]

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.9])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-20">
        <img
          src="/images/hero-stadium.png"
          alt="Kohistan Enclave 360 Cricket Arena floodlit at night"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Dark gradient + floodlight sweep overlays */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/40 to-background"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 animate-flood bg-[radial-gradient(60%_50%_at_50%_-10%,oklch(0.86_0.18_96/0.28),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-lines opacity-40" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto max-w-5xl px-4 pt-24 text-center sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wide text-primary"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Now open for night bookings under floodlights
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Kohistan Enclave, Wah Cantt
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
        >
          Play under the
          <span className="block text-primary text-glow">floodlights</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          A premium enclosed 360° cricket arena by Kohistan Enclave. Book the
          ground, grab a membership, and host your next match on championship
          turf — day or night.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-105 glow-yellow"
          >
            Book Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#packages"
            className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold text-foreground transition-colors hover:bg-white/10"
          >
            <PlayCircle className="h-5 w-5 text-primary" />
            View Packages
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl glass px-3 py-5">
              <div className="font-display text-2xl font-bold text-primary sm:text-4xl">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
