"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function NewProjectForm({ label = "New project" }: { label?: string }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
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

  function open() {
    setName("")
    setSlug("")
    setError("")
    dialogRef.current?.showModal()
  }

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={open}>{label}</button>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-1">New project</h3>
          <p className="text-base-content/60 text-sm mb-4">Each project gets its own collection URL and API key.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="proj-name"><span className="label-text">Project name</span></label>
              <input
                id="proj-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My App"
                required
                autoFocus
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="proj-slug"><span className="label-text">Slug</span></label>
              <input
                id="proj-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-app"
                required
                className="input input-bordered w-full"
              />
              {slug && <label className="label"><span className="label-text-alt font-mono">/collect/{slug}</span></label>}
            </div>
            {error && <div className="alert alert-error py-2 text-sm"><span>{error}</span></div>}
            <div className="modal-action mt-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => dialogRef.current?.close()}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-xs" /> : "Create project"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </>
  )
}
