import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Rate limiting: max 3 submissions per IP per hour
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown"
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 })
  }

  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

  const formData = await req.formData()

  // Honeypot check — bots fill hidden fields, humans don't
  const honeypot = formData.get("_hp") as string | null
  if (honeypot) {
    // Silent drop: return success without saving
    return NextResponse.json({ ok: true, id: "honeypot" }, { status: 201 })
  }

  const authorName = formData.get("authorName") as string
  const text = (formData.get("text") as string) ?? ""
  const role = (formData.get("role") as string) || null
  const rating = formData.get("rating") ? Number(formData.get("rating")) : null
  const type = ((formData.get("type") as string) ?? "TEXT") === "VIDEO" ? "VIDEO" : "TEXT"
  const file = formData.get("photo") as File | null
  const videoFile = formData.get("video") as File | null

  if (!authorName) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  if (type === "TEXT" && !text) {
    return NextResponse.json({ error: "Name and testimonial text required" }, { status: 400 })
  }

  // Collect custom field values
  const customFields = (project.customFields ?? []) as { id: string; label: string }[]
  const customFieldValues: Record<string, string> = {}
  for (const field of customFields) {
    const val = formData.get(`custom_${field.id}`) as string | null
    if (val) customFieldValues[field.label] = val
  }

  let avatarUrl: string | null = null
  let videoUrl: string | null = null

  // Photo upload
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

  // Video upload
  if (type === "VIDEO" && videoFile && videoFile.size > 0) {
    if (videoFile.size > 200 * 1024 * 1024) {
      return NextResponse.json({ error: "Video must be under 200MB" }, { status: 400 })
    }
    const ext = videoFile.name.split(".").pop() ?? "webm"
    const path = `${project.id}/video-${Date.now()}.${ext}`
    const bytes = await videoFile.arrayBuffer()
    const { error: uploadError } = await supabaseAdmin.storage
      .from("testimonials-video")
      .upload(path, bytes, { contentType: videoFile.type || "video/webm", upsert: false })
    if (uploadError) {
      // Try creating the bucket first (it might not exist)
      await supabaseAdmin.storage.createBucket("testimonials-video", { public: true })
      const { error: retryError } = await supabaseAdmin.storage
        .from("testimonials-video")
        .upload(path, bytes, { contentType: videoFile.type || "video/webm", upsert: false })
      if (retryError) {
        return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
      }
    }
    const { data } = supabaseAdmin.storage.from("testimonials-video").getPublicUrl(path)
    videoUrl = data.publicUrl
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      projectId: project.id,
      authorName,
      text,
      role,
      rating,
      avatarUrl,
      videoUrl,
      type,
      customFieldValues: Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined,
    },
  })

  return NextResponse.json({ ok: true, id: testimonial.id }, { status: 201 })
}
