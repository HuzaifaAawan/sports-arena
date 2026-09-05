import { FieldValue } from "firebase-admin/firestore"
import { getAdminDb } from "@/lib/firebase-admin"

export type UserRole = "customer" | "staff"

interface UserProfileInput {
  name: string | null
  email: string | null
  photoURL: string | null
}

/**
 * Reads the Firestore `users/{uid}` doc for this signed-in user.
 * Creates it with role "customer" on first login.
 * Never overwrites an existing `role` — that's the only place role
 * changes, and it's edited manually in the Firebase console (see README).
 */
export async function getOrCreateUserRole(
  uid: string,
  profile: UserProfileInput
): Promise<UserRole> {
  const ref = getAdminDb().collection("users").doc(uid)
  const snap = await ref.get()

  if (!snap.exists) {
    await ref.set({
      ...profile,
      role: "customer",
      createdAt: FieldValue.serverTimestamp(),
    })
    return "customer"
  }

  const role = snap.data()?.role
  return role === "staff" ? "staff" : "customer"
}
