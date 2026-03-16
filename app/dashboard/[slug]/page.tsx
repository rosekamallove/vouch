import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import ApiKeyPanel from "./api-key-panel"
import TestimonialTabs from "./testimonial-tabs"
import CopyButton from "./copy-button"
import ProjectSettings from "./project-settings"
import { cn } from "@/lib/utils"

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { slug } = await params
  const { tab } = await searchParams

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { testimonials: { orderBy: { createdAt: "desc" } } },
  })

  if (!project || project.userId !== session.user.id) notFound()

  const pending = project.testimonials.filter((t) => t.status === "PENDING")
  const approved = project.testimonials.filter((t) => t.status === "APPROVED")
  const rejected = project.testimonials.filter((t) => t.status === "REJECTED")

  const collectUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/collect/${slug}`
  const activeSection = tab ?? "testimonials"

  return (
    <div className="flex-1 flex flex-col space-y-5 p-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl">
        <div className={cn(
          "px-5 py-4 transition-colors",
          pending.length > 0 ? "bg-primary/8 dark:bg-primary/10" : ""
        )}>
          <div className={cn(
            "text-2xl font-semibold tabular-nums leading-none",
            pending.length > 0 ? "text-primary-foreground dark:text-primary" : ""
          )}>
            {pending.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Pending review</div>
        </div>
        <div className="px-5 py-4">
          <div className="text-2xl font-semibold tabular-nums leading-none">{approved.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Approved</div>
        </div>
        <div className="px-5 py-4">
          <div className="text-2xl font-semibold tabular-nums leading-none">{rejected.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Rejected</div>
        </div>
      </div>

      {activeSection === "testimonials" && (
        <TestimonialTabs pending={pending} approved={approved} rejected={rejected} />
      )}

      {activeSection === "api" && (
        <ApiKeyPanel projectId={project.id} apiKey={project.apiKey} slug={slug} />
      )}

      {activeSection === "settings" && (
        <ProjectSettings
          projectId={project.id}
          initial={{
            logoUrl: project.logoUrl,
            brandColor: project.brandColor,
            headline: project.headline,
            description: project.description,
            customFields: project.customFields as { id: string; label: string; placeholder: string; required: boolean }[] | null,
          }}
        />
      )}
    </div>
  )
}
