"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  MessageSquareQuote,
  Link2,
  Check,
  ChevronRight,
  LayoutList,
  KeyRound,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import NewProjectForm from "@/app/dashboard/new-project-form"
import { signOut } from "next-auth/react"

type Project = {
  id: string
  name: string
  slug: string
  pendingCount: number
}

const PROJECT_NAV = [
  { key: "testimonials", label: "Testimonials", icon: LayoutList, href: (slug: string) => `/dashboard/${slug}` },
  { key: "api", label: "API Access", icon: KeyRound, href: (slug: string) => `/dashboard/${slug}?tab=api` },
  { key: "settings", label: "Settings", icon: Settings, href: (slug: string) => `/dashboard/${slug}?tab=settings` },
]

export default function AppSidebar({
  projects,
  userEmail,
}: {
  projects: Project[]
  userEmail: string
}) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [copied, setCopied] = useState(false)

  const slugMatch = pathname.match(/^\/dashboard\/([^/?]+)/)
  const activeSlug = slugMatch?.[1] ?? null

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
  const activeTab = searchParams?.get("tab") ?? "testimonials"

  async function copyCollectLink() {
    if (!activeSlug) return
    const url = `${window.location.origin}/collect/${activeSlug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Sidebar className="border-none" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <MessageSquareQuote className="size-4" />
                </div>
                <span className="font-semibold text-base">Vouch</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between pl-0 p-2">
            <SidebarGroupLabel className="text-sm">Projects</SidebarGroupLabel>
            <NewProjectForm label="+" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.length === 0 && (
                <SidebarMenuItem>
                  <span className="px-2 text-xs text-sidebar-foreground/40">No projects yet</span>
                </SidebarMenuItem>
              )}
              {projects.map((project) => {
                const isActive = activeSlug === project.slug
                return (
                  <Collapsible
                    key={project.id}
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={isActive} tooltip={project.name}>
                          <span className="truncate flex-1">{project.name}</span>
                          {project.pendingCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold bg-yellow-400 text-yellow-900">
                              {project.pendingCount}
                            </span>
                          )}
                          <ChevronRight className="ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {PROJECT_NAV.map(({ key, label, icon: Icon, href }) => {
                            const isSubActive = isActive && activeTab === key
                            return (
                              <SidebarMenuSubItem key={key}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <Link href={href(project.slug)}>
                                    <Icon className="size-3.5" />
                                    {label}
                                    {key === "testimonials" && project.pendingCount > 0 && (
                                      <span className="ml-auto text-[10px] font-semibold text-yellow-600 dark:text-yellow-400">
                                        {project.pendingCount}
                                      </span>
                                    )}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {activeSlug && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={copyCollectLink}>
                {copied ? <Check className="size-4 text-yellow-500" /> : <Link2 className="size-4" />}
                {copied ? "Copied!" : "Copy collect link"}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="size-4" />
              Sign out
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="px-2 py-1">
              <p className="text-xs text-sidebar-foreground/50 truncate">{userEmail}</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
