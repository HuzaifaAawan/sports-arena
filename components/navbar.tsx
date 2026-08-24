'use client'

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Facility', href: '#facility' },
  { label: 'Booking', href: '#booking' },
  { label: 'Packages', href: '#packages' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Events', href: '#events' },
  { label: 'Contact', href: '#contact' },
]

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.2-5l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.8 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.4C41.8 36 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}

function AuthButton({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div
        className={
          variant === 'desktop'
            ? 'h-9 w-9 animate-pulse rounded-full bg-white/10'
            : 'h-10 animate-pulse rounded-lg bg-white/10'
        }
      />
    )
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className={
          variant === 'desktop'
            ? 'flex items-center gap-2 rounded-full glass px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-white/10'
            : 'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground'
        }
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? 'Account'}
            className="h-6 w-6 rounded-full"
          />
        ) : null}
        <span className="max-w-[8rem] truncate">{session.user.name ?? 'Sign out'}</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn('google')}
      className={
        variant === 'desktop'
          ? 'flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10'
          : 'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground'
      }
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 40)
  })

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? 'my-2 rounded-full glass py-2.5 shadow-lg shadow-black/30 backdrop-blur-xl'
            : 'py-5'
        }`}
      >
        <a href="#home" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">
            360
          </span>
          <span className="hidden font-display text-lg font-semibold leading-none tracking-wide sm:block">
            KOHISTAN ENCLAVE
            <span className="block text-[11px] font-normal tracking-[0.3em] text-primary">
              CRICKET ARENA
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <AuthButton variant="desktop" />
          </div>
          <a
            href="#booking"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 sm:block"
          >
            Book Now
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full glass lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-4 mt-2 flex flex-col gap-1 rounded-2xl glass p-4 lg:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-1 border-t border-white/10 pt-2">
              <AuthButton variant="mobile" />
            </div>
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Book Now
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
