import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { ids, status } = await req.json()

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 })
  }

  if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  // Verify all testimonials belong to user's projects
  const testimonials = await prisma.testimonial.findMany({
    where: { id: { in: ids } },
    include: { project: { select: { userId: true } } },
  })

  const userId = session.user!.id
  const allOwned = testimonials.every((t) => t.project.userId === userId)
  if (!allOwned || testimonials.length !== ids.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.testimonial.updateMany({ where: { id: { in: ids } }, data: { status } })

  return NextResponse.json({ ok: true, count: ids.length })
}
