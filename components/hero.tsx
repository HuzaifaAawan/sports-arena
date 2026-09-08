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
          alt="Champions Yard multi-sport arena floodlit at night"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Dark gradient + floodlight sweep overlays */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/40 to-background"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 animate-flood bg-[radial-gradient(60%_50%_at_50%_-10%,rgb(218_160_23/0.28),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-lines opacity-40" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto max-w-5xl px-4 pt-12 text-center sm:px-6 sm:pt-14"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wide text-primary"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Now open for night bookings under floodlights
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Champions Yard, Wah Cantt
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
        >
          PREMIUM SPORTS
          <span className="block text-primary text-glow">ARENA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.35em] text-foreground/90"
        >
          Play. Compete. Become <span className="text-primary">Champions</span>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mx-auto mt-4 max-w-xl rounded-2xl bg-foreground/95 px-4 py-3 text-pretty text-sm font-medium leading-relaxed text-black backdrop-blur-md sm:px-5 sm:py-3.5 sm:text-base"
        >
          Champions Yard is a premium multi-sport arena for padel, soccer,
          and cricket. Book your court, grab a membership, and play your
          next match on championship-grade surfaces — day or night.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105 glow-yellow sm:px-7 sm:py-3.5"
          >
            Book Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#packages"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold text-foreground transition-colors hover:bg-white/10 sm:px-7 sm:py-3.5"
          >
            <PlayCircle className="h-5 w-5 text-primary" />
            View Packages
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mx-auto mt-5 grid max-w-2xl grid-cols-3 gap-2.5 sm:mt-6 sm:gap-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl glass px-2.5 py-2.5 sm:px-3 sm:py-3">
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
