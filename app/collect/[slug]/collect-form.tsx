"use client"

import { useState, useRef, useEffect } from "react"
import { Star, Camera, CheckCircle2, Video, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type CustomField = { id: string; label: string; placeholder: string; required: boolean }

function StarPicker({ value, onChange, color }: { value: number; onChange: (v: number) => void; color?: string }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="transition-all hover:scale-110 active:scale-95"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star === value ? 0 : star)}
        >
          <Star
            className="w-6 h-6"
            fill={star <= (hovered || value) ? "currentColor" : "none"}
            style={{ color: star <= (hovered || value) ? (color ?? "#f5a623") : "oklch(0.92 0.004 286.375)" }}
          />
        </button>
      ))}
    </div>
  )
}

function VideoRecorder({ onVideo, onClear }: { onVideo: (file: File) => void; onClear: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [state, setState] = useState<"idle" | "ready" | "recording" | "done">("idle")
  const [seconds, setSeconds] = useState(0)
  const [camError, setCamError] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if ((state === "ready" || state === "recording") && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [state])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      setState("ready")
    } catch {
      setCamError("Camera access denied. Please allow camera & microphone permissions.")
    }
  }

  function startRecording() {
    if (!streamRef.current) return
    chunksRef.current = []
    const preferredTypes = ["video/webm;codecs=vp8,opus", "video/webm", "video/mp4"]
    const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t)) ?? ""
    const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const type = recorder.mimeType || "video/webm"
      const ext = type.includes("mp4") ? "mp4" : "webm"
      const blob = new Blob(chunksRef.current, { type })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      const file = new File([blob], `recording-${Date.now()}.${ext}`, { type })
      onVideo(file)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      setState("done")
      if (timerRef.current) clearInterval(timerRef.current)
    }
    recorder.start()
    setState("recording")
    setSeconds(0)
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s >= 119) { recorder.stop(); return 120 }
        return s + 1
      })
    }, 1000)
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function reset() {
    setPreviewUrl(null)
    setSeconds(0)
    setState("idle")
    onClear()
  }

  const timeLeft = 120 - seconds
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  if (state === "done" && previewUrl) {
    return (
      <div className="space-y-2">
        <video src={previewUrl} controls className="w-full rounded-xl border border-border" style={{ maxHeight: "240px" }} />
        <Button type="button" variant="ghost" size="sm" onClick={reset} className="text-xs h-7">Re-record</Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {state !== "idle" && (
        <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {state === "recording" && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-600/90 rounded-full px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-mono">{mins}:{secs.toString().padStart(2, "0")}</span>
            </div>
          )}
        </div>
      )}
      {camError && <p className="text-destructive text-xs">{camError}</p>}
      <div className="flex gap-2 flex-wrap">
        {state === "idle" && (
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={startCamera}>
            <Video className="w-4 h-4" />
            Enable camera
          </Button>
        )}
        {state === "ready" && (
          <Button type="button" size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-2" onClick={startRecording}>
            <span className="w-2 h-2 rounded-full bg-white" />
            Start recording
          </Button>
        )}
        {state === "recording" && (
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={stopRecording}>
            <span className="w-3 h-3 rounded-sm bg-foreground" />
            Stop ({mins}:{secs.toString().padStart(2, "0")} left)
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CollectForm({
  slug,
  customFields = [],
  brandColor,
}: {
  slug: string
  customFields?: CustomField[]
  brandColor?: string
}) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rating, setRating] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError("Photo must be under 2MB"); return }
    setPreview(URL.createObjectURL(file))
    setError("")
  }

  function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 200 * 1024 * 1024) { setError("Video must be under 200MB"); return }
    setVideoFile(file)
    setError("")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    if (rating > 0) form.set("rating", String(rating))

    if (videoFile) {
      form.set("video", videoFile)
      form.set("type", "VIDEO")
    } else {
      form.set("type", "TEXT")
    }

    const res = await fetch(`/api/collect/${slug}`, { method: "POST", body: form })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-card border border-border animate-slide-up">
        <div className="p-8 text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-yellow-500 mx-auto animate-scale-in" />
          <div className="space-y-1">
            <h2 className="font-bold text-xl">You&apos;re awesome!</h2>
            <p className="text-muted-foreground text-sm">Your testimonial is in — we&apos;ll review it shortly.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
            Pending review
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card border border-border animate-slide-up">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot */}
          <input name="_hp" type="text" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          {/* Photo + name row */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-foreground/30 transition-all"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-5 h-5 text-muted-foreground/50" />
              )}
            </div>
            <div className="space-y-1">
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                {preview ? "Change photo" : "Add a photo"}
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or WebP · max 2MB</p>
            </div>
            <input ref={fileRef} type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          </div>

          {/* Name + role */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Your name <span className="text-yellow-500">*</span></label>
              <Input name="authorName" required placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Role / Company</label>
              <Input name="role" placeholder="CEO at Acme" />
            </div>
          </div>

          {/* Written testimonial */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your thoughts <span className="text-yellow-500">*</span></label>
              <span className="text-xs text-muted-foreground">{text.length} / 500</span>
            </div>
            <textarea
              name="text"
              required
              maxLength={500}
              rows={4}
              placeholder="Tell us about your experience — the good stuff, the aha moments…"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Star rating */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">How would you rate it?</label>
            <StarPicker value={rating} onChange={setRating} color={brandColor} />
          </div>

          {/* Video — optional */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Add a video <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <VideoRecorder
                onVideo={(file) => setVideoFile(file)}
                onClear={() => setVideoFile(null)}
              />
              {!videoFile && (
                <>
                  <div className="flex items-center gap-3 my-1">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">or upload a file</span>
                    <Separator className="flex-1" />
                  </div>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/mov"
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-border file:text-xs file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
                    onChange={handleVideoUpload}
                  />
                  <p className="text-xs text-muted-foreground">MP4, WebM or MOV · max 200MB · up to 2 min</p>
                </>
              )}
              {videoFile && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/40 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    Video ready
                  </span>
                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => setVideoFile(null)}>Remove</Button>
                </div>
              )}
            </div>
          </div>

          {/* Custom questions */}
          {customFields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <label className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-yellow-500 ml-1">*</span>}
              </label>
              <Input
                name={`custom_${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            style={{ backgroundColor: brandColor, borderColor: brandColor, color: "#fff" }}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send my testimonial"}
          </Button>
        </form>
      </div>
    </div>
  )
}
