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

function webhookSecret(): string {
  const secret = process.env.SAFEPAY_WEBHOOK_SECRET
  if (!secret) throw new Error('Missing SAFEPAY_WEBHOOK_SECRET in .env.local')
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
 * Checkout.create() exactly. `webhooks: true` tells Safepay to also POST
 * an async payment.succeeded / payment.failed event to our webhook route
 * — this is the reliable confirmation path, since some payment methods
 * (cards especially) complete without ever sending the browser back to
 * `redirectUrl`.
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

/**
 * Step 4 — verify an async webhook call actually came from Safepay.
 * Mirrors @sfpy/node-sdk's Verify.webhook() exactly (read from its
 * published source, not guessed): HMAC-SHA512 of
 * `Buffer.from(JSON.stringify(data))` — where `data` is the webhook
 * body's `data` field — using the webhook secret from Safepay's
 * dashboard (Developer section), compared against the `x-sfpy-signature`
 * header. This is a *different* secret and a *different* algorithm from
 * `verifySafepaySignature` above — don't mix them up.
 */
export function verifySafepayWebhook(params: {
  signature: string | null
  data: unknown
}): boolean {
  if (!params.signature || params.data === undefined) return false
  const crypto = require('crypto') as typeof import('crypto')
  const payload = Buffer.from(JSON.stringify(params.data))
  const expected = crypto
    .createHmac('sha512', webhookSecret())
    .update(payload)
    .digest('hex')
  return expected === params.signature
}

/**
 * Step 5 — ask Safepay directly whether a tracker's payment has actually
 * completed. This is the belt-and-suspenders path: unlike the redirect
 * callback and the webhook, it doesn't depend on Safepay successfully
 * reaching *us* — we reach out to *them* instead. Useful when neither the
 * browser redirect nor the webhook fires (seen in testing with some card
 * payments). Matches the documented
 * `GET /reporter/api/v1/payments/{tracker}` contract field-for-field
 * against Safepay's own example response.
 */
export async function fetchSafepayTrackerStatus(
  tracker: string,
): Promise<{ paid: boolean; raw: unknown }> {
  const res = await fetch(
    `${apiBase()}/reporter/api/v1/payments/${encodeURIComponent(tracker)}`,
    {
      method: 'GET',
      headers: { 'X-SFPY-MERCHANT-SECRET': v1Secret() },
    },
  )

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `Safepay reporter/api/v1/payments failed (${res.status}): ${text}`,
    )
  }

  const json = await res.json()
  const paid =
    json?.status?.message === 'success' &&
    json?.data?.tracker?.state === 'TRACKER_ENDED'

  return { paid, raw: json }
}
