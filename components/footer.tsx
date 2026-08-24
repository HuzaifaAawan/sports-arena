'use client'

import { Share2, Globe, Send, ArrowUpRight } from 'lucide-react'

const nav = [
  { label: 'About', href: '#about' },
  { label: 'Facility', href: '#facility' },
  { label: 'Booking', href: '#booking' },
  { label: 'Packages', href: '#packages' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Events', href: '#events' },
]

const policies = ['Booking Policy', 'Cancellation & Refunds', 'Code of Conduct', 'Privacy Policy']

const socials = [
  { icon: Share2, href: '#', label: 'Instagram' },
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Send, href: '#', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">
                360
              </span>
              <span className="font-display text-lg font-semibold leading-none tracking-wide">
                KOHISTAN ENCLAVE
                <span className="block text-[11px] font-normal tracking-[0.3em] text-primary">
                  CRICKET ARENA
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The community's premium enclosed 360° cricket arena. Book, play,
              and win under the floodlights.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full glass transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick nav
            </h4>
            <ul className="flex flex-col gap-2.5">
              {nav.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Policies
            </h4>
            <ul className="flex flex-col gap-2.5">
              {policies.map((p) => (
                <li key={p}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Ready to play?
            </h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Lock in your slot today and hit the turf tonight.
            </p>
            <a
              href="#booking"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Book Now
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Kohistan Enclave 360 Cricket Arena. All rights reserved.</p>
          <p>Built for the community.</p>
        </div>
      </div>
    </footer>
  )
}
