import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const authHeader = req.headers.get("authorization")
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (!apiKey) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
  }

  const project = await prisma.project.findUnique({ where: { slug } })

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })
  if (project.apiKey !== apiKey) return NextResponse.json({ error: "Invalid API key" }, { status: 401 })

  const testimonials = await prisma.testimonial.findMany({
    where: { projectId: project.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      authorName: true,
      role: true,
      text: true,
      rating: true,
      avatarUrl: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    project: project.slug,
    count: testimonials.length,
    testimonials,
  })
}
