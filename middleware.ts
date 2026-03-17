import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isOnDashboard = pathname.startsWith("/dashboard")
  const isOnOnboarding = pathname.startsWith("/onboarding")

  if ((isOnDashboard || isOnOnboarding) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/onboarding"],
}
