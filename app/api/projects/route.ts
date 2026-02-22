import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { nanoid } from "@/lib/utils"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, slug } = await req.json()
  if (!name || !slug) return NextResponse.json({ error: "Name and slug required" }, { status: 400 })

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")

  const existing = await prisma.project.findUnique({ where: { slug: cleanSlug } })
  if (existing) return NextResponse.json({ error: "Slug already taken" }, { status: 409 })

  const project = await prisma.project.create({
    data: { name, slug: cleanSlug, userId: session.user.id, apiKey: nanoid() },
  })

  return NextResponse.json(project, { status: 201 })
}
