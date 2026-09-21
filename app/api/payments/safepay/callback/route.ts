import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { verifySafepaySignature } from '@/lib/safepay'

// Safepay sends the customer's browser back here after a successful
// checkout. We accept both GET (query string) and POST (form/JSON body)
// since gateways vary in how they perform this redirect — whichever one
// actually carries `sig` + `tracker`, we use.
async function handle(request: NextRequest) {
  const origin = request.nextUrl.origin
  const bookingId = request.nextUrl.searchParams.get('bookingId')

  let sig = request.nextUrl.searchParams.get('sig')
  let tracker = request.nextUrl.searchParams.get('tracker')

  if ((!sig || !tracker) && request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') ?? ''
      if (contentType.includes('application/json')) {
        const body = await request.json()
        sig = sig ?? body?.sig ?? null
        tracker = tracker ?? body?.tracker ?? null
      } else {
        const form = await request.formData()
        sig = sig ?? (form.get('sig') as string | null)
        tracker = tracker ?? (form.get('tracker') as string | null)
      }
    } catch {
      // fall through — treated as invalid below
    }
  }

  if (!bookingId) {
    return NextResponse.redirect(`${origin}/?payment=error#booking`)
  }

  const valid = verifySafepaySignature({ sig, tracker })

  const db = getAdminDb()
  const bookingRef = db.collection('bookings').doc(bookingId)
  const snap = await bookingRef.get()

  // Extra safety: the token this callback verified against must match the
  // token we generated for this exact booking (set in the /create route).
  const tokenMatches = snap.exists && snap.data()?.safepayToken === tracker

  if (!valid || !tokenMatches) {
    // Payment didn't actually go through — release the slot instead of
    // leaving it stuck "reserved" forever.
    if (snap.exists && !snap.data()?.paid) {
      await bookingRef.delete().catch(() => {})
    }
    return NextResponse.redirect(
      `${origin}/?payment=failed&bookingId=${encodeURIComponent(bookingId)}#booking`,
    )
  }

  await bookingRef.update({
    paid: true,
    status: 'confirmed',
    paidAt: new Date().toISOString(),
  })

  return NextResponse.redirect(
    `${origin}/?payment=success&bookingId=${encodeURIComponent(bookingId)}#booking`,
  )
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}
