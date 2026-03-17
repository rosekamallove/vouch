import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { OnboardingShell } from "./onboarding-shell"

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { slug: urlSlug } = await searchParams

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingStep: true, name: true },
  })

  const onboardingStep = user?.onboardingStep ?? 0
  if (onboardingStep >= 4) redirect("/dashboard")

  // If user already has a project (step >= 2) but no slug in URL, fetch it
  let initialSlug = urlSlug
  if (onboardingStep >= 2 && !initialSlug) {
    const project = await prisma.project.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { slug: true },
    })
    initialSlug = project?.slug ?? ""
  }

  // DB step 0 → display step 1, DB step 1 → display step 2, etc.
  const currentStep = Math.min(onboardingStep + 1, 4)

  return (
    <OnboardingShell
      initialStep={currentStep}
      initialSlug={initialSlug ?? ""}
      userName={user?.name ?? ""}
    />
  )
}
