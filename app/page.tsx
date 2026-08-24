import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Facilities } from '@/components/facilities'
import { Booking } from '@/components/booking'
import { Packages } from '@/components/packages'
import { Gallery } from '@/components/gallery'
import { Events } from '@/components/events'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { WhatsappButton } from '@/components/whatsapp-button'

export default function Page() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Facilities />
      <Booking />
      <Packages />
      <Gallery />
      <Events />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsappButton />
    </main>
  )
}
