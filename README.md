# Kohistan Enclave — Cricket Arena

Live: https://kohistan-sports-arena.vercel.app

## Stack (what's actually in this repo)

Built with **Next.js 16 (App Router) + TypeScript + Tailwind**, not the
plain Vite+SCSS stack from the original spec doc — that's fine, this is a
newer/equivalent approach (scaffolded via v0.app). Auth is **NextAuth.js
(Auth.js v5) with the Google provider** — not Firebase Auth's own popup
flow. **Firestore** is still used, but only as a database (for the
`users/{uid}` role doc), written server-side through the **Firebase Admin
SDK**. **Stripe/payments is not implemented yet** — "Confirm Booking" is
currently a front-end-only demo.

## Local setup

```bash
git clone https://github.com/HuzaifaAawan/sports-arena.git
cd sports-arena
corepack enable
pnpm install
pnpm approve-builds   # press spacebar on msw, then Enter
cp .env.example .env.local   # then fill in the values below
pnpm dev
```

## Environment variables

Copy `.env.example` to `.env.local` for local dev, **and** add the same
variables in Vercel → your project → **Settings → Environment Variables**
(Production **and** Preview) — `.env.local` is git-ignored and never
reaches Vercel on its own; forgetting this step is the #1 reason Google
Sign-in works locally but fails on the live URL.

| Variable | Where to get it |
|---|---|
| `AUTH_GOOGLE_ID` | Google Cloud Console → APIs & Services → Credentials → your OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | same OAuth Client, "Client secret" |
| `AUTH_SECRET` | generate with `npx auth secret` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Console → Project Settings → Service Accounts → **Generate new private key** (downloads a JSON file) — paste the file's **entire content as one line** into this variable. Don't split it into separate project/email/key vars — a multi-line PEM key split across `.env` fields is what breaks in practice; one JSON blob avoids all the quoting/escaping issues. |

## Fixing "Google Sign-in doesn't work on the production link"

This app authenticates with **NextAuth + Google OAuth directly** (not
Firebase Auth), so the fix is on the Google Cloud side, not Firebase's
"Authorized domains" list. Check these in order:

1. **Vercel env vars missing** (most common cause) — `AUTH_GOOGLE_ID`,
   `AUTH_GOOGLE_SECRET`, `AUTH_SECRET` must be set in Vercel → Settings →
   Environment Variables for **Production**. Redeploy after adding them
   (Vercel → Deployments → ⋯ → Redeploy).
2. **Google Cloud Console → Credentials → your OAuth Client** — under
   *Authorized redirect URIs* add:
   `https://kohistan-sports-arena.vercel.app/api/auth/callback/google`
   and under *Authorized JavaScript origins* add:
   `https://kohistan-sports-arena.vercel.app`
   (keep the `localhost:3000` versions too, for local dev). Missing this
   causes a `redirect_uri_mismatch` error on the Google consent screen.
3. If it still fails, check **Vercel → your project → Runtime Logs** for
   the actual error thrown by the `/api/auth/*` route — that error message
   tells you exactly which of the above is missing.
4. If sign-in works but then fails with a Firestore "UNAUTHENTICATED"
   error (visible in the terminal running `pnpm dev`), check your **system
   clock** — Windows → Settings → Time & Language → Date & Time → make
   sure "Set time automatically" is on and click "Sync now". Google
   rejects the service-account token if the machine's clock has drifted.
5. If you ever add a **custom domain** later, repeat step 2 for that
   domain too.

## Firebase — role-based staff dashboard

- `users/{uid}` docs are created automatically on first Google sign-in
  with `role: "customer"`, via `lib/roles.ts` (server-side, Firebase Admin
  SDK). The `role` field is **never** overwritten by the app after that.
- **To promote someone to staff:** Firebase Console → Firestore Database →
  `users` collection → find their doc (doc ID = their Google account ID,
  visible via `email` field in the doc) → edit the `role` field to
  `"staff"`. They need to sign out and sign back in for it to take effect.
- `/staff-dashboard` is a protected route (`app/staff-dashboard/page.tsx`)
  — anyone without `role: "staff"` (including logged-out users) is
  redirected to `/`. A "Dashboard" link appears in the navbar only for
  staff.
- `firestore.rules` in this repo denies **all** direct client access to
  `users/*` — only the server (Admin SDK, trusted code) ever reads/writes
  it, which is what makes `role` impossible for a user to self-promote.
  Paste this file's contents into Firebase Console → Firestore Database →
  Rules, then **Publish**.
- `firestore.rules` also covers the `bookings` collection used by the
  booking widget: reads are public (the calendar is public info anyway),
  and a booking doc can only be **created** with the right shape — never
  updated or deleted from the client. This matches the "front-end demo"
  phase (no Stripe yet); once payment is wired in, move booking creation
  server-side and tighten this further.

## Payments (Stripe) — not built yet

The booking widget's "Confirm Booking" is currently a UI-only demo (no
real charge, no backend call). Still to do:

- Add the `stripe` package and an `api/create-checkout-session` route that
  creates a Stripe Checkout Session server-side using `STRIPE_SECRET_KEY`
  (test-mode key), never exposed to the frontend.
- Point "Confirm Booking" at that endpoint and redirect to the returned
  Checkout URL.
- Add `/booking-success` and handle Stripe's cancel redirect back to the
  booking section.
- Env vars needed (local `.env.local` + Vercel): `STRIPE_SECRET_KEY`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Moving from Stripe **test** mode to **live** mode later is just
  swapping the test keys for live keys in Vercel's env vars — no code
  changes needed.

## Deployment

Deploys via the GitHub → Vercel integration (push to the connected branch
triggers a build). No `vercel.json` is needed — Next.js App Router routes
are handled natively by Vercel, so there's no SPA-rewrite step like a pure
Vite app would need.
