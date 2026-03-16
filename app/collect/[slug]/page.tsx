import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CollectForm from "./collect-form"

type CustomField = { id: string; label: string; placeholder: string; required: boolean }

export default async function CollectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) notFound()

  const brandColor = project.brandColor ?? "#f5a623"
  const customFields = (project.customFields ?? []) as CustomField[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Brand header */}
      <div
        className="w-full py-8 px-6 text-center space-y-3"
        style={{ backgroundColor: brandColor + "22", borderBottom: `2px solid ${brandColor}44` }}
      >
        {project.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.logoUrl} alt={project.name} className="h-12 object-contain mx-auto" />
        )}
        <h1 className="text-2xl font-bold">
          {project.headline ?? "Share your experience"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {project.description ?? <>Leave a testimonial for <strong>{project.name}</strong></>}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-lg space-y-6">
          <CollectForm slug={slug} customFields={customFields} brandColor={brandColor} />
          <p className="text-center text-xs text-muted-foreground">
            Powered by <a href="/" className="hover:underline">Vouch</a>
          </p>
        </div>
      </div>
    </div>
  )
}
