import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { createSafepayOrder, buildSafepayCheckoutUrl } from '@/lib/safepay'

// Starts a Safepay payment for an existing pending booking.
//
// The amount is ALWAYS re-read from Firestore here — never trusted from
// the request body — so a tampered client request can't pay less than the
// real slot price.
export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()
    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    const db = getAdminDb()
    const bookingRef = db.collection('bookings').doc(bookingId)
    const snap = await bookingRef.get()
    if (!snap.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const booking = snap.data()!
    if (booking.paid) {
      return NextResponse.json({ error: 'Booking is already paid' }, { status: 400 })
    }

    const amount = Number(booking.total)
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Booking has no valid total' }, { status: 400 })
    }

    const { token } = await createSafepayOrder({ amount, currency: 'PKR' })

    const origin = request.nextUrl.origin
    const url = buildSafepayCheckoutUrl({
      token,
      orderId: bookingId,
      redirectUrl: `${origin}/api/payments/safepay/callback?bookingId=${encodeURIComponent(bookingId)}`,
      cancelUrl: `${origin}/api/payments/safepay/cancel?bookingId=${encodeURIComponent(bookingId)}`,
      // Ask Safepay to also fire an async webhook to /api/payments/safepay/webhook.
      // That's the reliable confirmation path — see lib/safepay.ts for why the
      // browser redirect alone isn't enough for some payment methods (cards).
      webhooks: true,
    })

    // Remember which Safepay token this booking's payment session used, so
    // the callback route (and the webhook route) can double-check they're
    // looking at the right order.
    await bookingRef.update({ safepayToken: token })

    return NextResponse.json({ url })
  } catch (err) {
    console.error('[safepay/create]', err)
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 })
  }
}
