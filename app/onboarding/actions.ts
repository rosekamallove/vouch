"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slugify"
import { nanoid } from "@/lib/utils"

export async function advanceOnboardingStep(step: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingStep: true },
  })

  if (user && step > user.onboardingStep) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingStep: step },
    })
  }
}

export async function createOnboardingProject(
  name: string
): Promise<{ slug: string; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  let slug = slugify(name)
  if (!slug) return { slug: "", error: "Invalid project name" }

  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
  }

  await prisma.project.create({
    data: { name, slug, userId: session.user.id, apiKey: nanoid() },
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: 2 },
  })

  return { slug }
}

export async function completeOnboarding() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: 4 },
  })
}
