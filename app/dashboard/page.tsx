import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import NewProjectForm from "./new-project-form"
import SignOutButton from "./sign-out-button"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { testimonials: true } },
      testimonials: { where: { status: "PENDING" }, select: { id: true } },
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-6 py-3 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
        <span className="font-semibold tracking-tight">✦ Vouch</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs text-muted-foreground hidden sm:block">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Your projects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {projects.length === 0
                ? "Nothing here yet — let's change that"
                : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <NewProjectForm />
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-20 text-center space-y-4 animate-slide-up">
            <div className="text-5xl">🌱</div>
            <div className="space-y-1">
              <p className="font-semibold">Plant your first project</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Create a project, share the link with your users, and watch the testimonials roll in.
              </p>
            </div>
            <NewProjectForm />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 animate-slide-up">
            {projects.map((project, i) => {
              const pendingCount = project.testimonials.length
              return (
                <Link key={project.id} href={`/dashboard/${project.slug}`} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="rounded-xl border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all group space-y-3 h-full">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">/{project.slug}</p>
                      </div>
                      {pendingCount > 0 && (
                        <Badge className="bg-primary/15 text-primary border-primary/20 hover:bg-primary/15 text-xs shrink-0">
                          {pendingCount} pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        /collect/{project.slug}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {project._count.testimonials} total
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
