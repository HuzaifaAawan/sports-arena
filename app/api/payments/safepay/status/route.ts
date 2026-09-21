import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { fetchSafepayTrackerStatus } from '@/lib/safepay'

// On-demand reconciliation. The frontend calls this whenever it notices a
// booking that's still "pending_payment" — on page load, or when the tab
// regains focus — to ask Safepay directly whether the payment actually
// went through, instead of only waiting on a browser redirect or a
// webhook that (as observed in testing) may never arrive for some
// payment methods.
export async function GET(request: NextRequest) {
  const bookingId = request.nextUrl.searchParams.get('bookingId')
  if (!bookingId) {
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
    return NextResponse.json({ paid: true, status: booking.status })
  }

  const tracker: string | undefined = booking.safepayToken
  if (!tracker) {
    return NextResponse.json({
      paid: false,
      status: booking.status ?? 'pending_payment',
    })
  }

  try {
    const result = await fetchSafepayTrackerStatus(tracker)
    if (result.paid) {
      // Idempotent — a later webhook or another /status check for the
      // same booking is safe to land here too.
      await bookingRef.update({
        paid: true,
        status: 'confirmed',
        paidAt: new Date().toISOString(),
        paymentTracker: tracker,
      })
      return NextResponse.json({ paid: true, status: 'confirmed' })
    }
    return NextResponse.json({
      paid: false,
      status: booking.status ?? 'pending_payment',
    })
  } catch (err) {
    console.error('[safepay/status]', err)
    // Don't fail the page over this — just report "still pending". The
    // next check (page focus, or the daily reconciliation cron) will retry.
    return NextResponse.json({
      paid: false,
      status: booking.status ?? 'pending_payment',
    })
  }
}
