import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import NewProjectForm from "./new-project-form"
import SignOutButton from "./sign-out-button"
import OnboardingBanner from "./onboarding-banner"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingStep: true },
  })

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { testimonials: true } },
      testimonials: { where: { status: "PENDING" }, select: { id: true } },
    },
  })

  const hasApprovedAny = await prisma.testimonial.findFirst({
    where: { project: { userId: session.user.id }, status: "APPROVED" },
  })

  const onboardingSteps = [
    { label: "Create a project", done: projects.length > 0 },
    { label: "Share your link", done: (user?.onboardingStep ?? 0) >= 2 },
    { label: "Approve first testimonial", done: !!hasApprovedAny },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <header className="border-b border-base-300 px-6 py-3 flex items-center justify-between sticky top-0 bg-base-100/95 backdrop-blur z-10">
        <span className="font-semibold tracking-tight">✦ Vouch</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs text-base-content/50 hidden sm:block">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6 animate-fade-in">
        {/* Onboarding */}
        <OnboardingBanner steps={onboardingSteps} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Your projects</h1>
            <p className="text-sm text-base-content/50 mt-0.5">
              {projects.length === 0
                ? "Nothing here yet — let's change that"
                : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <NewProjectForm />
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed border-base-300 rounded-2xl py-20 text-center space-y-4 animate-slide-up">
            <div className="text-5xl">🌱</div>
            <div className="space-y-1">
              <p className="font-semibold">Plant your first project</p>
              <p className="text-sm text-base-content/50 max-w-xs mx-auto">
                Create a project, share the link with your users, and watch the testimonials roll in.
              </p>
            </div>
            <NewProjectForm label="Create your first project" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 animate-slide-up">
            {projects.map((project, i) => {
              const pendingCount = project.testimonials.length
              return (
                <Link key={project.id} href={`/dashboard/${project.slug}`} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="card bg-base-200 border border-base-300 hover:border-primary/50 hover:shadow-md transition-all group h-full">
                    <div className="card-body py-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-base-content/50 font-mono">/{project.slug}</p>
                        </div>
                        {pendingCount > 0 && (
                          <span className="badge badge-warning badge-sm shrink-0">{pendingCount} pending</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-base-content/40 font-mono truncate">/collect/{project.slug}</p>
                        <span className="text-xs text-base-content/40 shrink-0">{project._count.testimonials} total</span>
                      </div>
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
