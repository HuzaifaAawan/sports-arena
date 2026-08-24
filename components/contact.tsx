'use client'

import { MapPin, Phone, Mail, Clock, MessageCircle, Check, Send } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from './motion-primitives'

const info = [
  { icon: MapPin, label: 'Location', value: 'Kohistan Enclave, GT Road, Wah Cantt' },
  { icon: Phone, label: 'Phone', value: '+92 300 000 0360' },
  { icon: Mail, label: 'Email', value: 'play@kohistan360.pk' },
  { icon: Clock, label: 'Hours', value: 'Open daily, 8:00 AM – 12:00 AM' },
]

export function Contact() {
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3500)
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Location & contact
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
                Come play with us
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Drop by, call, or message us on WhatsApp to lock in your slot.
                We are right inside Kohistan Enclave.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {info.map((item, i) => (
                <Reveal key={item.label} delay={0.12 + i * 0.06}>
                  <div className="flex items-start gap-3 rounded-2xl glass p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="text-sm font-medium">{item.value}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title="Kohistan Enclave 360 Cricket Arena location"
                  src="https://www.google.com/maps?q=Kohistan+Enclave+Wah+Cantt&output=embed"
                  className="h-56 w-full grayscale-[0.3] contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <a
                href="https://wa.me/923000000360"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] glow-yellow"
              >
                <MessageCircle className="h-5 w-5" />
                Book instantly on WhatsApp
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form
              onSubmit={submit}
              className="flex h-full flex-col gap-4 rounded-3xl glass p-6 sm:p-8"
            >
              <h3 className="font-display text-2xl font-bold">Send a message</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Name"
                  className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <input
                  required
                  placeholder="Phone"
                  className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <input
                type="email"
                required
                placeholder="Email"
                className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <select
                className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
                defaultValue=""
              >
                <option value="" disabled>
                  What do you need?
                </option>
                <option>Ground booking</option>
                <option>Membership</option>
                <option>Corporate / event</option>
                <option>Academy trials</option>
                <option>Other</option>
              </select>
              <textarea
                required
                rows={4}
                placeholder="Tell us about your booking..."
                className="resize-none rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {sent ? (
                  <>
                    <Check className="h-4 w-4" />
                    Message sent!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
