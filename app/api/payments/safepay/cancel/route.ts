import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// Customer backed out of the Safepay checkout page. Free up the slot they
// had reserved (the booking doc was only ever a placeholder until paid)
// so someone else can book it right away, instead of it sitting stuck as
// "reserved but unpaid" forever.
async function handle(request: NextRequest) {
  const origin = request.nextUrl.origin
  const bookingId = request.nextUrl.searchParams.get('bookingId')

  if (bookingId) {
    try {
      const db = getAdminDb()
      const bookingRef = db.collection('bookings').doc(bookingId)
      const snap = await bookingRef.get()
      // Only delete if it was never actually paid — never touch a
      // confirmed/paid booking, even if this route is hit unexpectedly.
      if (snap.exists && !snap.data()?.paid) {
        await bookingRef.delete()
      }
    } catch (err) {
      console.error('[safepay/cancel]', err)
    }
  }

  return NextResponse.redirect(`${origin}/?payment=cancelled#booking`)
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}
