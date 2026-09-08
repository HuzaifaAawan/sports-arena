'use client'

import { Shirt, Backpack, CupSoda, MessageCircle } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem, TiltCard } from './motion-primitives'

// Placeholder catalog — final products, pricing, and images to be supplied
// later. Each "Order" button opens WhatsApp with a pre-filled message,
// matching the site's existing WhatsApp-fulfillment pattern (see
// components/whatsapp-button.tsx) so orders route through the same channel
// as bookings until a full checkout flow is built.
type Product = {
  name: string
  desc: string
  icon: typeof Shirt
}

const products: Product[] = [
  {
    name: 'Champions Yard Jersey',
    desc: 'Navy & gold match jersey, sizes S–XXL.',
    icon: Shirt,
  },
  {
    name: 'Team Duffel Bag',
    desc: 'Durable kit bag with the club crest.',
    icon: Backpack,
  },
  {
    name: 'Water Bottle',
    desc: 'Insulated bottle, navy & gold finish.',
    icon: CupSoda,
  },
]

function waLink(productName: string) {
  const text = encodeURIComponent(
    `Hi, I'd like to order: ${productName} — Champions Yard Merchandise`,
  )
  return `https://wa.me/923000000360?text=${text}`
}

export function Merchandise() {
  return (
    <section id="merchandise" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Merchandise
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Gear up like a champion
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Official Champions Yard apparel and gear. More products dropping
              soon — message us to order or ask what&apos;s available.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <StaggerItem key={product.name}>
              <TiltCard className="flex h-full flex-col items-center rounded-3xl glass p-8 text-center">
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <product.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {product.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {product.desc}
                </p>
                <a
                  href={waLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                </a>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
