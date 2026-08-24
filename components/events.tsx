'use client'

import { CalendarDays, Trophy, Users, Clock } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives'

const events = [
  {
    date: 'SEP 06',
    title: 'Enclave Night League — Week 1',
    type: 'Tournament',
    time: '6:00 PM – 11:00 PM',
    slots: '4 team slots left',
    icon: Trophy,
  },
  {
    date: 'SEP 14',
    title: 'Corporate Smash Cup',
    type: 'Corporate',
    time: '2:00 PM – 9:00 PM',
    slots: '8 team slots left',
    icon: Users,
  },
  {
    date: 'SEP 21',
    title: 'Weekend Tape-Ball Knockout',
    type: 'Open',
    time: '9:00 AM – 6:00 PM',
    slots: '12 team slots left',
    icon: Trophy,
  },
  {
    date: 'SEP 28',
    title: 'Junior Academy Trials',
    type: 'Academy',
    time: '10:00 AM – 1:00 PM',
    slots: 'Open registration',
    icon: Users,
  },
]

export function Events() {
  return (
    <section id="events" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Reveal>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Events & tournaments
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
                Upcoming fixtures
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <CalendarDays className="h-4 w-4 text-primary" />
              Register a team
            </a>
          </Reveal>
        </div>

        <StaggerGroup className="mt-12 flex flex-col gap-3">
          {events.map((e) => (
            <StaggerItem key={e.title}>
              <div className="group flex flex-col gap-4 rounded-2xl glass p-5 transition-colors hover:border-primary/40 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <span className="font-display text-xs font-medium">
                    {e.date.split(' ')[0]}
                  </span>
                  <span className="font-display text-2xl font-bold leading-none">
                    {e.date.split(' ')[1]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <e.icon className="h-3 w-3" />
                    {e.type}
                  </div>
                  <h3 className="font-display text-lg font-semibold">{e.title}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {e.time}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <span className="text-sm font-medium text-primary">
                    {e.slots}
                  </span>
                  <a
                    href="#booking"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform group-hover:scale-105"
                  >
                    Join
                  </a>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
