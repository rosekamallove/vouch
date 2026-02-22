"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${
            star <= (hovered || value) ? "text-amber-400" : "text-muted-foreground/30"
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
      <Card>
        <CardContent className="pt-8 pb-8 text-center space-y-2">
          <div className="text-4xl">🎉</div>
          <h2 className="font-semibold text-lg">Thank you!</h2>
          <p className="text-muted-foreground text-sm">
            Your testimonial has been submitted and is pending review.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 cursor-pointer border-2 border-dashed hover:border-foreground/30 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground text-center px-1">Add photo</span>
              )}
            </div>
            <div>
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                {preview ? "Change photo" : "Upload photo"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WebP · max 2MB</p>
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
            <div className="space-y-1">
              <Label htmlFor="authorName">Your name *</Label>
              <Input id="authorName" name="authorName" required placeholder="Jane Doe" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">Role / Company</Label>
              <Input id="role" name="role" placeholder="CEO at Acme" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="text">Your testimonial *</Label>
            <Textarea
              id="text"
              name="text"
              required
              maxLength={500}
              rows={4}
              placeholder="Share your experience…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground text-right">{text.length}/500</p>
          </div>

          <div className="space-y-1">
            <Label>Rating (optional)</Label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
