import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CollectForm from "./collect-form"

export default async function CollectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) notFound()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Share your experience</h1>
          <p className="text-muted-foreground text-sm">
            Leave a testimonial for <strong>{project.name}</strong>
          </p>
        </div>
        <CollectForm slug={slug} />
        <p className="text-center text-xs text-muted-foreground">
          Powered by <a href="/" className="underline">Vouch</a>
        </p>
      </div>
    </div>
  )
}
