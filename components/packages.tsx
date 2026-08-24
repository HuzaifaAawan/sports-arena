'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Reveal, StaggerGroup, StaggerItem, TiltCard } from './motion-primitives'

type Plan = {
  name: string
  price: string
  cadence: string
  desc: string
  features: string[]
  featured?: boolean
}

const plans: Plan[] = [
  {
    name: 'Hourly Booking',
    price: 'Rs 2,500',
    cadence: 'per hour',
    desc: 'Casual games and quick practice sessions.',
    features: [
      'Full ground access',
      'Turf + basic equipment',
      'Daytime slots from Rs 2,500',
      'Night slots under floodlights',
      'Free parking',
    ],
  },
  {
    name: 'Monthly Membership',
    price: 'Rs 18,000',
    cadence: 'per month',
    desc: 'For regular teams who live on the pitch.',
    features: [
      '8 booked hours / month',
      '20% off extra bookings',
      'Priority slot reservations',
      'Members lounge access',
      'Free match recording (2/mo)',
      'Guest passes included',
    ],
    featured: true,
  },
  {
    name: 'Corporate / Event',
    price: 'Custom',
    cadence: 'per event',
    desc: 'Tournaments, corporate leagues and galas.',
    features: [
      'Full-day arena buyout',
      'Dedicated event manager',
      'Catering via café & lounge',
      'Branding & scoreboard setup',
      'Multi-angle recording',
      'Seating for spectators',
    ],
  },
]

export function Packages() {
  const [checkout, setCheckout] = useState<Plan | null>(null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle')

  function purchase() {
    setStatus('processing')
    setTimeout(() => setStatus('done'), 1600)
  }

  function close() {
    setCheckout(null)
    setStatus('idle')
  }

  return (
    <section id="packages" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Packages & membership
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Pick the plan that fits your game
            </h2>
          </Reveal>
        </div>

        <StaggerGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <TiltCard
                className={`relative flex h-full flex-col rounded-3xl p-7 ${
                  plan.featured
                    ? 'bg-primary text-primary-foreground glow-yellow'
                    : 'glass'
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                <p
                  className={`mt-1 text-sm ${plan.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                >
                  {plan.desc}
                </p>
                <div className="mt-5 flex items-end gap-1.5">
                  <span className="font-display text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span
                    className={`pb-1 text-sm ${plan.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                  >
                    {plan.cadence}
                  </span>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                          plan.featured
                            ? 'bg-background/25'
                            : 'bg-primary/15 text-primary'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setCheckout(plan)
                    setStatus('idle')
                  }}
                  className={`mt-7 rounded-xl py-3 font-semibold transition-transform hover:scale-[1.02] ${
                    plan.featured
                      ? 'bg-background text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {plan.name === 'Corporate / Event' ? 'Get a Quote' : 'Purchase'}
                </button>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      {/* Checkout modal */}
      <AnimatePresence>
        {checkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl glass p-7"
            >
              {status === 'done' ? (
                <div className="text-center">
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Welcome to the arena!
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your {checkout.name.toLowerCase()} is active. A confirmation
                    has been sent to your inbox.
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold">Checkout</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {checkout.name} — {checkout.price} {checkout.cadence}
                  </p>

                  <div className="mt-5 space-y-3">
                    <input
                      placeholder="Full name"
                      className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <input
                      placeholder="Email address"
                      type="email"
                      className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <input
                      placeholder="Card number"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <div className="flex gap-3">
                      <input
                        placeholder="MM / YY"
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                      <input
                        placeholder="CVC"
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <button
                    onClick={purchase}
                    disabled={status === 'processing'}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {status === 'processing' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${checkout.price === 'Custom' ? 'deposit' : checkout.price}`
                    )}
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Demo checkout — no real payment is processed.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
