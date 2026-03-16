import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OnboardingBanner from "./onboarding-banner"
import NewProjectForm from "./new-project-form"
import { Sprout, MessageSquareQuote } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const [user, projects, hasApprovedAny] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboardingStep: true },
    }),
    prisma.project.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    }),
    prisma.testimonial.findFirst({
      where: { project: { userId: session.user.id }, status: "APPROVED" },
    }),
  ])

  const onboardingSteps = [
    { label: "Create a project", done: projects.length > 0 },
    { label: "Share your link", done: (user?.onboardingStep ?? 0) >= 2 },
    { label: "Approve first testimonial", done: !!hasApprovedAny },
  ]

  return (
    <div className="flex-1 flex flex-col px-6 py-8 space-y-6">
      <OnboardingBanner steps={onboardingSteps} />

      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-4">
        {projects.length === 0 ? (
          <>
            <Sprout className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <div className="space-y-1">
              <p className="font-semibold">Plant your first project</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Create a project, share the link with your users, and watch the testimonials roll in.
              </p>
            </div>
            <NewProjectForm label="Create a project" />
          </>
        ) : (
          <>
            <MessageSquareQuote className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">
              Select a project from the sidebar to get started
            </p>
          </>
        )}
      </div>
    </div>
  )
}
