"use client"

import { useState, useTransition } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createOnboardingProject } from "../actions"
import { slugify } from "@/lib/slugify"

export default function Step2({
  onNext,
}: {
  onNext: (slug: string) => void
}) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const previewSlug = slugify(name)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError("")
    startTransition(async () => {
      const result = await createOnboardingProject(name.trim())
      if (result.error) {
        setError(result.error)
        return
      }
      onNext(result.slug)
    })
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1
          className="text-white/95 leading-tight"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
          }}
        >
          Name your project
        </h1>
        <p className="text-white/40 text-[15px] leading-relaxed">
          A project is a container for testimonials — usually your product or a
          specific campaign.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2.5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome App"
            autoFocus
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[15px] placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all"
          />
          {previewSlug && (
            <p className="text-white/25 text-xs font-mono pl-1">
              vouch.so/collect/
              <span className="text-white/40">{previewSlug}</span>
            </p>
          )}
        </div>

        {error && (
          <p className="text-red-400/80 text-sm pl-1">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isPending || !name.trim()}
          size="lg"
          className="w-full text-base hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:hover:scale-100"
        >
          {isPending ? (
            <span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
          ) : (
            <>
              Create project
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
