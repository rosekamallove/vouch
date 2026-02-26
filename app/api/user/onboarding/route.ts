import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { step } = await req.json()

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { onboardingStep: true } })
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Only advance, never go back
  if (typeof step === "number" && step > user.onboardingStep) {
    await prisma.user.update({ where: { id: session.user.id }, data: { onboardingStep: step } })
  }

  return NextResponse.json({ ok: true })
}
