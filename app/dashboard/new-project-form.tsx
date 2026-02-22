"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewProjectForm() {
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
    router.push(`/dashboard/${project.slug}`)
  }

  function close() {
    setOpen(false)
    setName("")
    setSlug("")
    setError("")
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        New project
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={close}
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl border shadow-xl w-full max-w-md p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold">New project</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Each project gets its own collection URL and API key.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="proj-name">Project name</Label>
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
                  <Label htmlFor="proj-slug">Slug</Label>
                  <Input
                    id="proj-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-app"
                    required
                  />
                  {slug && (
                    <p className="text-xs text-muted-foreground font-mono">
                      /collect/{slug}
                    </p>
                  )}
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2 justify-end pt-1">
                  <Button type="button" variant="ghost" size="sm" onClick={close}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={loading}>
                    {loading ? "Creating…" : "Create project"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
