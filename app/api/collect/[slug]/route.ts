import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

  const formData = await req.formData()
  const authorName = formData.get("authorName") as string
  const text = formData.get("text") as string
  const role = formData.get("role") as string | null
  const rating = formData.get("rating") ? Number(formData.get("rating")) : null
  const file = formData.get("photo") as File | null

  if (!authorName || !text) {
    return NextResponse.json({ error: "Name and testimonial text required" }, { status: 400 })
  }

  let avatarUrl: string | null = null

  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Photo must be under 2MB" }, { status: 400 })
    }

    const ext = file.name.split(".").pop()
    const path = `${project.id}/${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await supabaseAdmin.storage
      .from("testimonials")
      .upload(path, bytes, { contentType: file.type, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from("testimonials").getPublicUrl(path)
    avatarUrl = data.publicUrl
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      projectId: project.id,
      authorName,
      text,
      role: role || null,
      rating,
      avatarUrl,
    },
  })

  return NextResponse.json({ ok: true, id: testimonial.id }, { status: 201 })
}
