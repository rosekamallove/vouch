import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/dashboard/app-sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      testimonials: { where: { status: "PENDING" }, select: { id: true } },
    },
  })

  const projectsForSidebar = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    pendingCount: p.testimonials.length,
  }))

  return (
    <SidebarProvider>
      <AppSidebar projects={projectsForSidebar} userEmail={session.user.email ?? ""} />
      <SidebarInset>
        <div className="flex bg-sidebar flex-1 flex-col p-4">
          <div className="bg-background rounded-xl border border-border/50 shadow-xs flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
