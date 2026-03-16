"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export default function NewProjectForm({ label = "New project" }: { label?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleNameChange(val: string) {
    setName(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
  }

  function handleOpen() {
    setName("")
    setSlug("")
    setError("")
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to create project")
      setLoading(false)
      return
    }

    const project = await res.json()
    setOpen(false)
    router.push(`/dashboard/${project.slug}`)
  }

  return (
    <>
      <Button size="icon-sm" className="text-background hover:bg-foreground/90" onClick={handleOpen}>
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm -mt-2">Each project gets its own collection URL and API key.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="proj-name">Project name</label>
              <Input
                id="proj-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My App"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="proj-slug">Slug</label>
              <Input
                id="proj-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-app"
                required
              />
              {slug && <p className="text-xs text-muted-foreground font-mono">/collect/{slug}</p>}
            </div>
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Create project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
