// Server-only. Never import this file from a Client Component.
//
// Talks to Safepay directly over HTTP/crypto (no @sfpy/node-sdk dependency)
// so it works even where `pnpm install` can't run. The logic below mirrors
// the official @sfpy/node-sdk (v3.0.2) source exactly — verified by
// downloading and reading its published source, not guessed from docs.

const API_URL_PRODUCTION = 'https://api.getsafepay.com'
const API_URL_SANDBOX = 'https://sandbox.api.getsafepay.com'
const CHECKOUT_PRODUCTION = 'https://getsafepay.com/checkout'
const CHECKOUT_SANDBOX = 'https://sandbox.api.getsafepay.com/checkout'

type SafepayEnv = 'sandbox' | 'production'

function env(): SafepayEnv {
  return process.env.SAFEPAY_ENV === 'production' ? 'production' : 'sandbox'
}

function apiBase(): string {
  return env() === 'production' ? API_URL_PRODUCTION : API_URL_SANDBOX
}

function checkoutBase(): string {
  return env() === 'production' ? CHECKOUT_PRODUCTION : CHECKOUT_SANDBOX
}

function apiKey(): string {
  const key = process.env.NEXT_PUBLIC_SAFEPAY_API_KEY
  if (!key) throw new Error('Missing NEXT_PUBLIC_SAFEPAY_API_KEY in .env.local')
  return key
}

function v1Secret(): string {
  const secret = process.env.SAFEPAY_SECRET_KEY
  if (!secret) throw new Error('Missing SAFEPAY_SECRET_KEY in .env.local')
  return secret
}

/**
 * Step 1 — open an order/payment session with Safepay for a given amount.
 * Returns a `token` (Safepay calls this the "tracker") used to build the
 * checkout link and, later, to identify the transaction on the redirect
 * back from Safepay.
 */
export async function createSafepayOrder(params: {
  amount: number
  currency?: 'PKR' | 'USD'
}): Promise<{ token: string }> {
  const res = await fetch(`${apiBase()}/order/v1/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: params.amount,
      client: apiKey(),
      currency: params.currency ?? 'PKR',
      environment: env(),
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Safepay order/v1/init failed (${res.status}): ${text}`)
  }

  const json = await res.json()
  const token = json?.data?.token
  if (!token) throw new Error('Safepay order/v1/init returned no token')
  return { token }
}

/**
 * Step 2 — build the hosted checkout URL the customer's browser is sent to.
 * This is pure URL-building (no network call), matching @sfpy/node-sdk's
 * Checkout.create() exactly.
 */
export function buildSafepayCheckoutUrl(params: {
  token: string
  orderId: string
  cancelUrl: string
  redirectUrl: string
  webhooks?: boolean
}): string {
  const qs = new URLSearchParams({
    beacon: params.token,
    cancel_url: params.cancelUrl,
    env: env(),
    order_id: params.orderId,
    redirect_url: params.redirectUrl,
    source: 'custom',
    webhooks: String(params.webhooks ?? false),
  })
  return `${checkoutBase()}/pay?${qs.toString()}`
}

/**
 * Step 3 — verify the `sig` + `tracker` Safepay sends back on redirect
 * actually came from Safepay (HMAC-SHA256 of `tracker` using our secret
 * key). Never mark a booking as paid without this check passing — a raw
 * "payment=success" query string on its own proves nothing.
 */
export function verifySafepaySignature(params: {
  sig: string | null
  tracker: string | null
}): boolean {
  if (!params.sig || !params.tracker) return false
  const crypto = require('crypto') as typeof import('crypto')
  const expected = crypto
    .createHmac('sha256', v1Secret())
    .update(params.tracker)
    .digest('hex')
  return expected === params.sig
}
