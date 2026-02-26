import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { tags } = await req.json()

  if (!Array.isArray(tags)) {
    return NextResponse.json({ error: "tags must be an array" }, { status: 400 })
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { project: { select: { userId: true } } },
  })

  if (!testimonial || testimonial.project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: { tags },
  })

  return NextResponse.json(updated)
}
