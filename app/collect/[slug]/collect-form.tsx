"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-all hover:scale-110 active:scale-95 ${
            star <= (hovered || value) ? "text-primary drop-shadow-sm" : "text-muted-foreground/25"
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star === value ? 0 : star)}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function CollectForm({ slug }: { slug: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rating, setRating] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [text, setText] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError("Photo must be under 2MB")
      return
    }
    setPreview(URL.createObjectURL(file))
    setError("")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    if (rating > 0) form.set("rating", String(rating))

    const res = await fetch(`/api/collect/${slug}`, { method: "POST", body: form })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center space-y-4 animate-slide-up">
        <div className="text-6xl animate-bounce">🎉</div>
        <div className="space-y-1">
          <h2 className="font-bold text-xl">You&apos;re awesome!</h2>
          <p className="text-muted-foreground text-sm">
            Your testimonial is in — we&apos;ll review it shortly. Thanks for taking the time!
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          Pending review
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-card animate-slide-up">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-primary/60 hover:bg-primary/15 transition-all"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">📷</span>
              )}
            </div>
            <div className="space-y-1">
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                {preview ? "Change photo" : "Add a photo"}
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or WebP · max 2MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="authorName">Your name <span className="text-primary">*</span></Label>
              <Input id="authorName" name="authorName" required placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role / Company</Label>
              <Input id="role" name="role" placeholder="CEO at Acme" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="text">
              What did you think? <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="text"
              name="text"
              required
              maxLength={500}
              rows={4}
              placeholder="Tell us about your experience — the good stuff, the aha moments, what changed for you…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground text-right">{text.length} / 500</p>
          </div>

          <div className="space-y-1.5">
            <Label>How would you rate it?</Label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Sending…" : "Send my testimonial ✦"}
          </Button>
        </form>
      </div>
    </div>
  )
}
