'use client'

import { Dumbbell, Goal, Target, Grid3x3 } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem, TiltCard } from './motion-primitives'

// Placeholder roster — swap in real coach names, photos and bios once
// they're confirmed. Kept to role titles + icons for now rather than
// inventing names.
const coaches = [
  {
    role: 'Head Coach — Cricket',
    focus: 'Net sessions, batting & bowling technique',
    icon: Target,
  },
  {
    role: 'Head Coach — Soccer',
    focus: 'Youth academy & competitive training',
    icon: Goal,
  },
  {
    role: 'Head Coach — Padel',
    focus: 'Beginner to advanced padel coaching',
    icon: Grid3x3,
  },
  {
    role: 'Fitness & Conditioning',
    focus: 'Strength, agility and match-fitness programs',
    icon: Dumbbell,
  },
]

export function Coaches() {
  return (
    <section id="coaches" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Our coaches
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Train with coaches who elevate your game
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Certified coaching across every sport we host — structured
              programs for beginners through competitive players.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((c) => (
            <StaggerItem key={c.role}>
              <TiltCard className="flex h-full flex-col items-center rounded-3xl glass p-7 text-center">
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <c.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-base font-semibold">
                  {c.role}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {c.focus}
                </p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
