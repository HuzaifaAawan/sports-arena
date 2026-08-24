'use client'

import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from './motion-primitives'

const images = [
  { src: '/images/gallery-1.png', alt: 'Batsman playing a shot under lights', span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/gallery-2.png', alt: 'Enclosed 360 net arena at night', span: '' },
  { src: '/images/gallery-3.png', alt: 'Cricket ball on green turf', span: '' },
  { src: '/images/gallery-5.png', alt: 'Fast bowler in action', span: 'sm:col-span-2' },
  { src: '/images/gallery-4.png', alt: 'Stadium seating and lounge', span: '' },
  { src: '/images/gallery-6.png', alt: 'Aerial view of the lit arena', span: '' },
]

export function Gallery() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Gallery
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Inside the arena
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-4 sm:auto-rows-[220px]">
            {images.map((img, i) => (
              <motion.button
                key={img.src}
                onClick={() => setActive(i)}
                whileHover={{ scale: 0.985 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 ${img.span}`}
              >
                <img
                  src={img.src || '/placeholder.svg'}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
                <span className="absolute bottom-3 left-3 text-left text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {img.alt}
                </span>
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-sm"
          >
            <button
              aria-label="Close"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full glass"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              key={active}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[active].src || '/placeholder.svg'}
              alt={images[active].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-5xl rounded-2xl border border-white/10 object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
