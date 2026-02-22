import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import ApiKeyPanel from "./api-key-panel"
import TestimonialTabs from "./testimonial-tabs"
import SignOutButton from "../sign-out-button"
import CopyButton from "./copy-button"

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { testimonials: { orderBy: { createdAt: "desc" } } },
  })

  if (!project || project.userId !== session.user.id) notFound()

  const pending = project.testimonials.filter((t) => t.status === "PENDING")
  const approved = project.testimonials.filter((t) => t.status === "APPROVED")
  const rejected = project.testimonials.filter((t) => t.status === "REJECTED")

  const collectUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/collect/${slug}`

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-6 py-3 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            ✦ Vouch
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs text-muted-foreground hidden sm:block">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-8 animate-fade-in">

        {/* Page header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Collection link</span>
            <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
              <code className="text-xs font-mono">{collectUrl}</code>
              <CopyButton text={collectUrl} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up">
          <div className={`rounded-xl border px-4 py-3 ${pending.length > 0 ? "border-primary/40 bg-primary/5" : ""}`}>
            <p className="text-2xl font-bold">{pending.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pending review</p>
          </div>
          <div className="rounded-xl border px-4 py-3">
            <p className="text-2xl font-bold">{approved.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Approved</p>
          </div>
          <div className="rounded-xl border px-4 py-3">
            <p className="text-2xl font-bold">{rejected.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Rejected</p>
          </div>
        </div>

        {/* PRIMARY: Testimonials */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Testimonials</h2>
          <TestimonialTabs pending={pending} approved={approved} rejected={rejected} />
        </section>

        {/* SECONDARY: API */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">API Access</h2>
          <ApiKeyPanel projectId={project.id} apiKey={project.apiKey} slug={slug} />
        </section>

      </main>
    </div>
  )
}
