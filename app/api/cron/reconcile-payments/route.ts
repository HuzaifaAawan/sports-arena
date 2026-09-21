import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { fetchSafepayTrackerStatus } from '@/lib/safepay'

// Daily safety net. Vercel's Hobby plan only allows once-a-day cron
// schedules (see vercel.json), so this isn't the primary confirmation
// path — /callback, the webhook, and the on-demand /api/payments/safepay/status
// check (called from the client on page load/focus) all try first and
// are much faster. This just sweeps up anything that slipped through all
// three: any booking still "pending_payment" with a Safepay token
// attached gets one more check against Safepay directly.
//
// Deliberately conservative: this only ever *confirms* a real payment.
// It never deletes or otherwise touches a booking that Safepay reports
// as not paid — that stays exactly as risky/safe as it already was.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getAdminDb()
  const pendingSnap = await db.collection('bookings').where('paid', '==', false).get()

  let checked = 0
  let confirmed = 0

  for (const bookingDoc of pendingSnap.docs) {
    const booking = bookingDoc.data()
    const tracker: string | undefined = booking.safepayToken
    if (!tracker) continue

    checked++
    try {
      const result = await fetchSafepayTrackerStatus(tracker)
      if (result.paid) {
        await bookingDoc.ref.update({
          paid: true,
          status: 'confirmed',
          paidAt: new Date().toISOString(),
          paymentTracker: tracker,
        })
        confirmed++
      }
    } catch (err) {
      console.error(`[cron/reconcile-payments] booking ${bookingDoc.id}`, err)
    }
  }

  return NextResponse.json({ checked, confirmed })
}
