'use client'

import { motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'

export function WhatsappButton() {
  return (
    <motion.a
      href="https://wa.me/923000000360?text=Hi%2C%20I%27d%20like%20to%20book%20a%20slot%20at%20Kohistan%20Enclave%20360%20Cricket%20Arena"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/30 animate-pulse-ring"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-sm sm:inline">Book on WhatsApp</span>
    </motion.a>
  )
}
