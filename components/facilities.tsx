'use client'

import {
  CircleDot,
  Lightbulb,
  Sprout,
  Armchair,
  Car,
  Coffee,
  ShowerHead,
  Camera,
} from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem, TiltCard } from './motion-primitives'

const facilities = [
  {
    icon: CircleDot,
    title: '360° Net-Roof Arena',
    desc: 'Fully enclosed netting on all sides and overhead — play freely with zero lost balls.',
  },
  {
    icon: Lightbulb,
    title: 'LED Night Lighting',
    desc: 'Broadcast-grade floodlights deliver true daylight visibility after dark.',
  },
  {
    icon: Sprout,
    title: 'Championship Turf',
    desc: 'Premium all-weather turf with true bounce, tested for professional play.',
  },
  {
    icon: Armchair,
    title: 'Spectator Seating',
    desc: 'Comfortable tiered seating so your crew never misses a single delivery.',
  },
  {
    icon: Car,
    title: 'Ample Parking',
    desc: 'Secure on-site parking for teams, guests, and event fleets.',
  },
  {
    icon: Coffee,
    title: 'Café & Lounge',
    desc: 'Refuel between overs at the in-house café and chill in the players lounge.',
  },
  {
    icon: ShowerHead,
    title: 'Dressing Rooms',
    desc: 'Clean changing rooms with showers and lockers for both squads.',
  },
  {
    icon: Camera,
    title: 'Match Recording',
    desc: 'Optional multi-angle recording so you can relive and analyse every game.',
  },
]

export function Facilities() {
  return (
    <section id="facility" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Facility highlights
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Everything a serious ground needs
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Purpose-built amenities that make every session feel professional.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((f) => (
            <StaggerItem key={f.title}>
              <TiltCard className="group h-full rounded-2xl glass p-6 transition-colors hover:border-primary/40">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
