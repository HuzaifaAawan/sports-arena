import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function StaffDashboardPage() {
  const session = await auth()

  // Not logged in, or logged in but role !== "staff" (default "customer")
  // both get bounced back to the public site.
  if (!session?.user || session.user.role !== "staff") {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          Staff Only
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Staff Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Signed in as {session.user.email}
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-muted-foreground">
            Bookings management, slot overrides, and reports go here.
            This is a placeholder — wire it up to real booking data next.
          </p>
        </div>
      </div>
    </main>
  )
}
