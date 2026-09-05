import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { getOrCreateUserRole } from "@/lib/roles"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  // Vercel normally auto-detects this, but setting it explicitly avoids
  // "UntrustedHost" errors on preview URLs / custom domains.
  trustHost: true,
  callbacks: {
    async jwt({ token, account, user }) {
      // `account` is only present on the initial sign-in request, so this
      // only hits Firestore once per login (not on every request).
      if (account?.providerAccountId) {
        token.uid = account.providerAccountId
        token.role = await getOrCreateUserRole(account.providerAccountId, {
          name: user?.name ?? null,
          email: user?.email ?? null,
          photoURL: user?.image ?? null,
        })
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.uid = token.uid
        session.user.role = token.role ?? "customer"
      }
      return session
    },
  },
})
