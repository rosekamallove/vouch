import type { Metadata } from "next"
import { DM_Serif_Display } from "next/font/google"

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
})

export const metadata: Metadata = {
  title: "Get started — Vouch",
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${dmSerif.variable} min-h-screen`}
      style={{ background: "#0a0a0a" }}
    >
      {children}
    </div>
  )
}
