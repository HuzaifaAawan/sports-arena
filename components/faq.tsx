'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from './motion-primitives'

const faqs = [
  {
    q: 'How do I book a court?',
    a: 'Head to the Booking section above, pick your sport — Cricket Net, Soccer Pitch, or Padel Court — choose a date and time slot, and confirm. Availability updates live, so what you see is always accurate.',
  },
  {
    q: 'Can I cancel or reschedule a booking?',
    a: 'Message us on WhatsApp or call ahead of your slot and we’ll help you reschedule or cancel. Please give us as much notice as possible so the slot can be released for other players.',
  },
  {
    q: 'Do I need to bring my own equipment?',
    a: 'Basic equipment is available at the facility. If you need cricket kits, soccer balls, or padel rackets reserved for your session, let us know in advance via WhatsApp.',
  },
  {
    q: 'What are your operating hours?',
    a: 'We’re open daily with extended hours, including floodlit night sessions. Check the Booking section for live slot availability across all three sports.',
  },
  {
    q: 'Do you offer memberships or packages?',
    a: 'Yes — see the Packages section above for hourly walk-in rates, monthly memberships, and corporate/event bookings, each with its own perks.',
  },
  {
    q: 'Is parking available?',
    a: 'Yes, free on-site parking is available for all players, members, and visitors.',
  },
  {
    q: 'Can I order Champions Yard merchandise?',
    a: 'Yes — check the Merchandise section above and message us on WhatsApp to place an order for jerseys, bags, and more.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_20%_50%,rgb(218_160_23/0.08),transparent_70%)]" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              FAQs
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Message us on
              WhatsApp and we&apos;ll get back to you.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl glass"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="font-display text-base font-semibold sm:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
