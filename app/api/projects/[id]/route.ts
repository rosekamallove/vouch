import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const { logoUrl, brandColor, headline, description, customFields } = body

  const updated = await prisma.project.update({
    where: { id },
    data: {
      logoUrl: logoUrl ?? null,
      brandColor: brandColor ?? null,
      headline: headline ?? null,
      description: description ?? null,
      customFields: customFields ?? undefined,
    },
  })

  return NextResponse.json(updated)
}
