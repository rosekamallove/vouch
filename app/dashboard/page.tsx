import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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
      testimonials: {
        where: { status: "PENDING" },
        select: { id: true },
      },
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-6 py-3 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
        <span className="font-semibold tracking-tight">Vouch</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {projects.length === 0 ? "No projects yet" : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <NewProjectForm />
        </div>

        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed py-20 text-center space-y-3">
            <p className="text-sm font-medium">No projects yet</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Create a project to get a collection link and start receiving testimonials.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => {
              const pendingCount = project.testimonials.length
              return (
                <Link key={project.id} href={`/dashboard/${project.slug}`}>
                  <div className="rounded-lg border bg-card p-4 hover:border-foreground/30 transition-colors group space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-semibold text-sm group-hover:text-foreground transition-colors truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">/{project.slug}</p>
                      </div>
                      {pendingCount > 0 && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs shrink-0 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
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
