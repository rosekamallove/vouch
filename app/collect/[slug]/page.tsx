import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CollectForm from "./collect-form"

type CustomField = { id: string; label: string; placeholder: string; required: boolean }

export default async function CollectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) notFound()

  const brandColor = project.brandColor ?? undefined
  const customFields = (project.customFields ?? []) as CustomField[]

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      {/* Brand header */}
      <div
        className="w-full py-16 px-8 text-center space-y-5"
        style={{
          backgroundColor: brandColor ? brandColor + "18" : "var(--color-muted)",
          borderBottom: `1px solid ${brandColor ? brandColor + "30" : "var(--color-border)"}`,
        }}
      >
        {project.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.logoUrl} alt={project.name} className="h-12 object-contain mx-auto" />
        ) : (
          <div
            className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-background border border-border shadow-sm text-base font-bold"
            style={{ color: brandColor ?? "var(--color-primary)" }}
          >
            {project.name.charAt(0).toUpperCase()}.
          </div>
        )}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">
            {project.headline ?? "Share your experience"}
          </h1>
          <p className="text-muted-foreground">
            {project.description ?? (
              <>Leave a testimonial for <strong>{project.name}</strong></>
            )}
          </p>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex flex-col items-center px-6 py-14">
        <div className="w-full max-w-3xl space-y-5">
          <CollectForm slug={slug} customFields={customFields} brandColor={brandColor} />
          <p className="text-center text-xs text-muted-foreground">
            Powered by{" "}
            <a href="/" className="hover:underline">
              Vouch
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
