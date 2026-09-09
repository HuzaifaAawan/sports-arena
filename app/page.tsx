import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Facilities } from '@/components/facilities'
import { Booking } from '@/components/booking'
import { Packages } from '@/components/packages'
import { Merchandise } from '@/components/merchandise'
import { Gallery } from '@/components/gallery'
import { Events } from '@/components/events'
import { Coaches } from '@/components/coaches'
import { Testimonials } from '@/components/testimonials'
import { FAQ } from '@/components/faq'
import { CtaBanner } from '@/components/cta-banner'
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
      <Merchandise />
      <Gallery />
      <Events />
      <Coaches />
      <Testimonials />
      <FAQ />
      <CtaBanner />
      <Contact />
      <Footer />
      <WhatsappButton />
    </main>
  )
}
