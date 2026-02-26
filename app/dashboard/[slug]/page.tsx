import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import ApiKeyPanel from "./api-key-panel"
import TestimonialTabs from "./testimonial-tabs"
import SignOutButton from "../sign-out-button"
import CopyButton from "./copy-button"
import ProjectSettings from "./project-settings"

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
    <div className="min-h-screen flex flex-col bg-base-100">
      <header className="border-b border-base-300 px-6 py-3 flex items-center justify-between sticky top-0 bg-base-100/95 backdrop-blur z-10">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-base-content/50 hover:text-base-content transition-colors font-medium">
            ✦ Vouch
          </Link>
          <span className="text-base-content/20">/</span>
          <span className="font-semibold">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs text-base-content/40 hidden sm:block">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-8 animate-fade-in">
        {/* Page header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-base-content/50">Collection link</span>
            <div className="flex items-center gap-1.5 bg-base-200 rounded-lg px-3 py-1.5">
              <code className="text-xs font-mono text-base-content/70">{collectUrl}</code>
              <CopyButton text={collectUrl} advanceOnboarding />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats stats-horizontal shadow border border-base-300 w-full animate-slide-up">
          <div className={`stat ${pending.length > 0 ? "bg-warning/10" : ""}`}>
            <div className="stat-value text-2xl">{pending.length}</div>
            <div className="stat-desc">Pending review</div>
          </div>
          <div className="stat">
            <div className="stat-value text-2xl">{approved.length}</div>
            <div className="stat-desc">Approved</div>
          </div>
          <div className="stat">
            <div className="stat-value text-2xl">{rejected.length}</div>
            <div className="stat-desc">Rejected</div>
          </div>
        </div>

        {/* Section tabs */}
        <div role="tablist" className="tabs tabs-bordered">
          <Link href={`/dashboard/${slug}`} role="tab" className={`tab ${activeSection === "testimonials" ? "tab-active" : ""}`}>
            Testimonials
          </Link>
          <Link href={`/dashboard/${slug}?tab=api`} role="tab" className={`tab ${activeSection === "api" ? "tab-active" : ""}`}>
            API Access
          </Link>
          <Link href={`/dashboard/${slug}?tab=settings`} role="tab" className={`tab ${activeSection === "settings" ? "tab-active" : ""}`}>
            Settings
          </Link>
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
      </main>
    </div>
  )
}
