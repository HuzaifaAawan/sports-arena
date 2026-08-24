'use client'

import { Reveal } from './motion-primitives'
import { ShieldCheck, Trophy, Users } from 'lucide-react'

const pills = [
  { icon: ShieldCheck, label: 'Built by the community' },
  { icon: Trophy, label: 'Championship-grade turf' },
  { icon: Users, label: 'Members-first culture' },
]

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <img
              src="/images/gallery-6.png"
              alt="Aerial view of the illuminated arena within Kohistan Enclave"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-4 rounded-2xl glass p-5 sm:right-6">
            <div className="font-display text-3xl font-bold text-primary">2024</div>
            <div className="text-xs text-muted-foreground">Vision realised</div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              About the arena
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              A home ground built by Kohistan Enclave
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              Kohistan Enclave 360 Cricket Arena was born from a simple idea —
              give the community a world-class place to play. What started as a
              society project is now a fully enclosed, floodlit arena engineered
              for serious cricket and unforgettable evenings.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              From weekend tape-ball tournaments to corporate leagues and
              professional practice, the arena is designed to host it all with
              premium turf, 360° netting, and stadium lighting that turns night
              into day.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-wrap gap-3">
            {pills.map((p, i) => (
              <Reveal key={p.label} delay={0.2 + i * 0.08}>
                <div className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
                  <p.icon className="h-4 w-4 text-primary" />
                  {p.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
