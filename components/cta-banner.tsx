'use client'

import { ArrowRight, MessageCircle } from 'lucide-react'
import { Reveal } from './motion-primitives'

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-primary" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_120%,rgb(13_27_45/0.35),transparent_70%)]" />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/70">
            Ready when you are
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-balance font-display text-3xl font-bold uppercase leading-tight text-primary-foreground sm:text-5xl">
            Ready to join the Champions Yard community?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
            Book your court, grab a membership, or just message us on
            WhatsApp — we&apos;ll get you on the pitch.
          </p>
        </Reveal>
        <Reveal
          delay={0.15}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 font-semibold text-foreground transition-transform hover:scale-105"
          >
            Book A Court
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="https://wa.me/923000000360"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-7 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  )
}
