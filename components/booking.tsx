'use client'

import { AnimatePresence, motion } from 'motion/react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Sun,
  Moon,
  Loader2,
  PartyPopper,
  LogIn,
  AlertCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Reveal } from './motion-primitives'

type Slot = { time: string; label: string; price: number; night: boolean }

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const SLOTS: Slot[] = [
  { time: '08:00', label: '8:00 AM', price: 2500, night: false },
  { time: '10:00', label: '10:00 AM', price: 2500, night: false },
  { time: '12:00', label: '12:00 PM', price: 3000, night: false },
  { time: '14:00', label: '2:00 PM', price: 3000, night: false },
  { time: '16:00', label: '4:00 PM', price: 3500, night: false },
  { time: '18:00', label: '6:00 PM', price: 4500, night: true },
  { time: '20:00', label: '8:00 PM', price: 5000, night: true },
  { time: '22:00', label: '10:00 PM', price: 4500, night: true },
]

function buildMonth(base: Date) {
  const year = base.getFullYear()
  const month = base.getMonth()
  const first = new Date(year, month, 1)
  const start = first.getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < start; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  return { cells, year, month }
}

export function Booking() {
  const { data: session } = useSession()
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [duration, setDuration] = useState(1)
  const [status, setStatus] = useState<'idle' | 'confirming' | 'done'>('idle')
  const [bookedTimes, setBookedTimes] = useState<Set<string>>(new Set())
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { cells, year, month } = useMemo(
    () => buildMonth(viewDate),
    [viewDate],
  )
  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const dateKey =
    selectedDay !== null ? `${year}-${month + 1}-${selectedDay}` : null

  // Live-subscribe to bookings for the selected date, so availability
  // updates instantly for everyone (no refresh needed).
  useEffect(() => {
    if (!dateKey) {
      setBookedTimes(new Set())
      return
    }
    const q = query(collection(db, 'bookings'), where('dateKey', '==', dateKey))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const times = new Set<string>()
        snap.forEach((d) => times.add(d.data().slotTime as string))
        setBookedTimes(times)
      },
      () => {
        // If Firestore rules/config aren't ready yet, fail open rather than
        // blocking the whole calendar.
        setBookedTimes(new Set())
      },
    )
    return () => unsubscribe()
  }, [dateKey])

  const canGoPrev =
    viewDate.getFullYear() > today.getFullYear() ||
    (viewDate.getFullYear() === today.getFullYear() &&
      viewDate.getMonth() > today.getMonth())

  function selectDay(day: number) {
    const cellDate = new Date(year, month, day)
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )
    if (cellDate < start) return
    setSelectedDay(day)
    setSelectedSlot(null)
    setStatus('idle')
    setErrorMsg(null)
  }

  const total = selectedSlot ? selectedSlot.price * duration : 0

  async function confirm() {
    if (!selectedSlot || !dateKey) return
    if (!session?.user) {
      signIn('google')
      return
    }

    setStatus('confirming')
    setErrorMsg(null)

    const bookingId = `${dateKey}_${selectedSlot.time}`
    const bookingRef = doc(db, 'bookings', bookingId)

    try {
      await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(bookingRef)
        if (existing.exists()) {
          throw new Error('ALREADY_BOOKED')
        }
        transaction.set(bookingRef, {
          dateKey,
          slotTime: selectedSlot.time,
          slotLabel: selectedSlot.label,
          duration,
          price: selectedSlot.price,
          total,
          userName: session.user?.name ?? null,
          userEmail: session.user?.email ?? null,
          createdAt: serverTimestamp(),
        })
      })
      setStatus('done')
    } catch (err) {
      if (err instanceof Error && err.message === 'ALREADY_BOOKED') {
        // Someone else grabbed this exact slot a moment before us. Block it
        // in the UI immediately (don't wait for the live listener to catch
        // up) so the user can't retry the same slot.
        setBookedTimes((prev) => new Set(prev).add(selectedSlot.time))
        setSelectedSlot(null)
        setErrorMsg('This slot was just booked by someone else. Please choose another slot.')
      } else {
        setErrorMsg('Something went wrong with your booking. Please try again.')
      }
      setStatus('idle')
    }
  }

  function reset() {
    setSelectedDay(null)
    setSelectedSlot(null)
    setDuration(1)
    setStatus('idle')
    setErrorMsg(null)
  }

  return (
    <section id="booking" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_80%_0%,oklch(0.86_0.18_96/0.1),transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Ground booking
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Reserve your slot in seconds
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Pick a date, choose a time slot with live availability, set your
              duration, and confirm instantly.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-5xl">
          <div className="grid gap-6 rounded-3xl glass p-4 sm:p-6 lg:grid-cols-2">
            {/* Calendar */}
            <div className="rounded-2xl bg-background/40 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-primary" />
                  {monthLabel}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      canGoPrev &&
                      setViewDate(new Date(year, month - 1, 1))
                    }
                    disabled={!canGoPrev}
                    aria-label="Previous month"
                    className="grid h-8 w-8 place-items-center rounded-lg glass disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewDate(new Date(year, month + 1, 1))}
                    aria-label="Next month"
                    className="grid h-8 w-8 place-items-center rounded-lg glass"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="py-1 font-medium">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                  if (day === null)
                    return <div key={`e-${i}`} className="aspect-square" />
                  const cellDate = new Date(year, month, day)
                  const start = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                  )
                  const past = cellDate < start
                  const active = selectedDay === day
                  return (
                    <button
                      key={day}
                      onClick={() => selectDay(day)}
                      disabled={past}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : past
                            ? 'cursor-not-allowed text-muted-foreground/30'
                            : 'hover:bg-white/10'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Slots + summary */}
            <div className="flex flex-col rounded-2xl bg-background/40 p-5">
              <div className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                {selectedDay
                  ? `Slots for ${new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}`
                  : 'Select a date'}
              </div>

              {!selectedDay ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
                  Choose a day from the calendar to see available time slots.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SLOTS.map((slot) => {
                      const booked = bookedTimes.has(slot.time)
                      const active = selectedSlot?.time === slot.time
                      return (
                        <button
                          key={slot.time}
                          disabled={booked}
                          onClick={() => {
                            setSelectedSlot(slot)
                            setStatus('idle')
                            setErrorMsg(null)
                          }}
                          className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-all ${
                            active
                              ? 'border-primary bg-primary/15'
                              : booked
                                ? 'cursor-not-allowed border-white/5 opacity-40'
                                : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center gap-1 text-sm font-semibold">
                            {slot.night ? (
                              <Moon className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Sun className="h-3.5 w-3.5 text-primary" />
                            )}
                            {slot.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {booked ? 'Booked' : `Rs ${slot.price.toLocaleString()}`}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium text-muted-foreground">
                      Duration (hours)
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((h) => (
                        <button
                          key={h}
                          onClick={() => setDuration(h)}
                          className={`h-9 flex-1 rounded-lg text-sm font-semibold transition-colors ${
                            duration === h
                              ? 'bg-primary text-primary-foreground'
                              : 'glass hover:bg-white/10'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {errorMsg ? (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        role="alert"
                        className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <span>{errorMsg}</span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="mt-auto pt-5">
                    <div className="mb-3 flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-display text-2xl font-bold text-primary">
                        {total ? `Rs ${total.toLocaleString()}` : '--'}
                      </span>
                    </div>
                    <button
                      onClick={confirm}
                      disabled={!selectedSlot || status !== 'idle'}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
                    >
                      {status === 'confirming' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Confirming...
                        </>
                      ) : !session?.user ? (
                        <>
                          <LogIn className="h-4 w-4" />
                          Sign in to Book
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {status === 'done' && selectedSlot && selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
            onClick={reset}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl glass p-8 text-center glow-yellow"
            >
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
                <PartyPopper className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl font-bold">Booking confirmed!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(year, month, selectedDay).toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                at {selectedSlot.label} for {duration}h.
              </p>
              <div className="my-5 rounded-xl bg-background/50 p-4">
                <div className="text-xs text-muted-foreground">Amount paid</div>
                <div className="font-display text-3xl font-bold text-primary">
                  Rs {total.toLocaleString()}
                </div>
              </div>
              <button
                onClick={reset}
                className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
