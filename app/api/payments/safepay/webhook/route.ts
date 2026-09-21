import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { verifySafepayWebhook } from '@/lib/safepay'

// Safepay's server calls this directly, independent of whether the
// customer's browser ever redirects back to /callback. This is the
// reliable confirmation path: some payment methods (cards especially, per
// what we saw in testing) complete on Safepay's side without the browser
// ever navigating back to `redirectUrl`, so /callback alone can leave a
// paid booking stuck as "pending_payment" forever.
//
// Safepay retries webhooks and can send more than one for the same
// tracker (e.g. a failed attempt followed by a successful retry on the
// same checkout session) — so this handler (a) must be idempotent and
// (b) must never delete a booking just because one webhook reports
// failure, since a later success webhook for that same tracker still
// needs the booking doc to exist so it can be marked paid.
export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const signature = request.headers.get('x-sfpy-signature')
  const valid = verifySafepayWebhook({ signature, data: body?.data })

  if (!valid) {
    console.error('[safepay/webhook] signature did not verify, ignoring')
    // Still respond 200 — a 4xx/5xx just makes Safepay retry a call we're
    // intentionally rejecting, and turns our response code into an oracle
    // for guessing a valid signature.
    return NextResponse.json({ ok: true })
  }

  const type: string | undefined = body?.type
  const data = body?.data ?? {}
  const tracker: string | undefined = data.tracker
  const metadataBookingId: string | undefined = data.metadata?.order_id

  if (!tracker) {
    return NextResponse.json({ ok: true })
  }

  const db = getAdminDb()

  // Prefer the booking id Safepay echoed back in metadata.order_id (that's
  // the `orderId` we passed when creating the checkout link). Fall back to
  // looking the booking up by its stored safepayToken, in case metadata is
  // ever missing for a given payment method.
  let ref = metadataBookingId ? db.collection('bookings').doc(metadataBookingId) : null
  let snap = ref ? await ref.get() : null

  if (!snap?.exists) {
    const query = await db
      .collection('bookings')
      .where('safepayToken', '==', tracker)
      .limit(1)
      .get()
    if (!query.empty) {
      ref = query.docs[0].ref
      snap = query.docs[0]
    }
  }

  if (!ref || !snap?.exists) {
    console.error(`[safepay/webhook] no booking found for tracker ${tracker}`)
    return NextResponse.json({ ok: true })
  }

  // Extra safety, mirroring the check /callback makes: the token this
  // webhook reports on must match the token we generated for this exact
  // booking.
  if (snap.data()?.safepayToken !== tracker) {
    console.error(`[safepay/webhook] tracker mismatch for booking ${ref.id}`)
    return NextResponse.json({ ok: true })
  }

  if (type === 'payment.succeeded') {
    // Idempotent — Safepay can (and does) deliver the same webhook more
    // than once.
    if (!snap.data()?.paid) {
      await ref.update({
        paid: true,
        status: 'confirmed',
        paidAt: new Date().toISOString(),
        paymentTracker: tracker,
      })
    }
  } else if (type === 'payment.failed') {
    // Deliberately NOT deleting or otherwise touching the booking here.
    // It stays "pending" — the customer may retry the same checkout
    // session, and a later payment.succeeded webhook for this same
    // tracker needs the booking doc to still exist. Bookings that are
    // truly abandoned are cleaned up by /cancel when the customer backs
    // out of checkout.
    console.error(
      `[safepay/webhook] payment failed for booking ${ref.id}: ${data.message ?? 'unknown reason'}`,
    )
  }

  return NextResponse.json({ ok: true })
}
