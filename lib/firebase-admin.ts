import { cert, getApps, getApp, initializeApp, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

// Server-only. Never import this file from a Client Component.
//
// Credentials come from ONE env var holding the full service-account JSON
// (as one line) rather than 3 separate vars. Splitting a multi-line PEM
// private key across .env files is fragile — different env loaders
// (dotenv vs @next/env) handle the \n / quoting differently, which is a
// classic source of "UNAUTHENTICATED" errors from Firestore even when the
// key "looks" fine. Storing the whole JSON sidesteps that entirely: no
// quoting/escaping ambiguity, JSON.parse() does the real work.
//
// Initialization is LAZY (only happens the first time getAdminDb() is
// actually called), not at module import time — so pages/routes that
// never touch Firestore still work even before this env var is set.
let cachedDb: Firestore | null = null

function getAdminApp(): App {
  if (getApps().length) return getApp()

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_JSON. Set it in .env.local locally, and in " +
        "Vercel Project Settings > Environment Variables in production (see .env.example)."
    )
  }

  let serviceAccount: { project_id: string; client_email: string; private_key: string }
  try {
    serviceAccount = JSON.parse(raw)
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste the ENTIRE downloaded " +
        "service-account file's content as a single line, unmodified."
    )
  }

  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  })
}

export function getAdminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getAdminApp())
  }
  return cachedDb
}
