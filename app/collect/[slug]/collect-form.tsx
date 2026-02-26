"use client"

import { useState, useRef, useEffect } from "react"

type CustomField = { id: string; label: string; placeholder: string; required: boolean }

function StarPicker({ value, onChange, color }: { value: number; onChange: (v: number) => void; color?: string }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="text-2xl transition-all hover:scale-110 active:scale-95"
          style={{ color: star <= (hovered || value) ? (color ?? "#f5a623") : "oklch(var(--bc)/0.2)" }}
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

function VideoRecorder({ onVideo, onClear }: { onVideo: (file: File) => void; onClear: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [state, setState] = useState<"idle" | "ready" | "recording" | "done">("idle")
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        videoRef.current.play()
      }
      setState("ready")
    } catch {
      setError("Camera access denied. Please allow camera & microphone permissions.")
    }
  }

  function startRecording() {
    if (!streamRef.current) return
    chunksRef.current = []
    const recorder = new MediaRecorder(streamRef.current, { mimeType: "video/webm;codecs=vp8,opus" })
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: "video/webm" })
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
        if (s >= 119) {
          recorder.stop()
          return 120
        }
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
        <video src={previewUrl} controls className="w-full rounded-xl max-h-64 object-cover border border-base-300" />
        <button type="button" className="btn btn-ghost btn-xs" onClick={reset}>Re-record</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {state !== "idle" && (
        <div className="relative rounded-xl overflow-hidden bg-base-300 aspect-video">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {state === "recording" && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-error/90 rounded-full px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-mono">{mins}:{secs.toString().padStart(2, "0")}</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="flex gap-2">
        {state === "idle" && (
          <button type="button" className="btn btn-outline btn-sm gap-2" onClick={startCamera}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 10 4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            Enable camera
          </button>
        )}
        {state === "ready" && (
          <button type="button" className="btn btn-error btn-sm gap-2" onClick={startRecording}>
            <span className="w-2 h-2 rounded-full bg-white" />
            Start recording
          </button>
        )}
        {state === "recording" && (
          <button type="button" className="btn btn-neutral btn-sm gap-2" onClick={stopRecording}>
            <span className="w-3 h-3 rounded-sm bg-white" />
            Stop ({mins}:{secs.toString().padStart(2, "0")} left)
          </button>
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
  const [mode, setMode] = useState<"text" | "video">("text")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const videoUploadRef = useRef<HTMLInputElement>(null)

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

    if (mode === "video") {
      if (!videoFile) { setError("Please record or upload a video"); setLoading(false); return }
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
      <div className="card bg-base-200 border border-base-300 animate-slide-up">
        <div className="card-body text-center space-y-4 py-10">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="space-y-1">
            <h2 className="font-bold text-xl">You&apos;re awesome!</h2>
            <p className="text-base-content/60 text-sm">Your testimonial is in — we&apos;ll review it shortly.</p>
          </div>
          <div className="badge badge-outline gap-1.5 py-3 px-4">
            <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />
            Pending review
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 border border-base-300 animate-slide-up">
      <div className="card-body">
        {/* Text / Video toggle */}
        <div className="join mb-2">
          <button type="button" className={`join-item btn btn-sm ${mode === "text" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("text")}>
            ✍️ Text
          </button>
          <button type="button" className={`join-item btn btn-sm ${mode === "video" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("video")}>
            ▶ Video
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot (hidden from humans) */}
          <input name="_hp" type="text" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          {mode === "text" ? (
            <>
              {/* Photo */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full bg-base-300 border-2 border-dashed border-base-content/20 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-base-content/40 transition-all"
                  style={{ borderColor: preview ? undefined : brandColor + "44" }}
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
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
                    {preview ? "Change photo" : "Add a photo"}
                  </button>
                  <p className="text-xs text-base-content/50">JPG, PNG or WebP · max 2MB</p>
                </div>
                <input ref={fileRef} type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Your name <span className="text-warning">*</span></span></label>
                  <input name="authorName" required placeholder="Jane Doe" className="input input-bordered w-full" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Role / Company</span></label>
                  <input name="role" placeholder="CEO at Acme" className="input input-bordered w-full" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">What did you think? <span className="text-warning">*</span></span>
                  <span className="label-text-alt">{text.length} / 500</span>
                </label>
                <textarea
                  name="text"
                  required
                  maxLength={500}
                  rows={4}
                  placeholder="Tell us about your experience — the good stuff, the aha moments…"
                  className="textarea textarea-bordered w-full"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">How would you rate it?</span></label>
                <StarPicker value={rating} onChange={setRating} color={brandColor} />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Your name <span className="text-warning">*</span></span></label>
                  <input name="authorName" required placeholder="Jane Doe" className="input input-bordered w-full" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Role / Company</span></label>
                  <input name="role" placeholder="CEO at Acme" className="input input-bordered w-full" />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Record your video</span></label>
                <VideoRecorder
                  onVideo={(file) => setVideoFile(file)}
                  onClear={() => setVideoFile(null)}
                />
              </div>

              <div className="divider text-xs text-base-content/40">OR upload a file</div>

              <div className="form-control">
                <input
                  ref={videoUploadRef}
                  type="file"
                  accept="video/mp4,video/webm,video/mov"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={handleVideoUpload}
                />
                <label className="label"><span className="label-text-alt">MP4, WebM or MOV · max 200MB · up to 2 minutes</span></label>
              </div>
            </>
          )}

          {/* Custom questions */}
          {customFields.map((field) => (
            <div key={field.id} className="form-control">
              <label className="label">
                <span className="label-text">
                  {field.label}
                  {field.required && <span className="text-warning ml-1">*</span>}
                </span>
              </label>
              <input
                name={`custom_${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
                className="input input-bordered w-full"
              />
            </div>
          ))}

          {error && <div className="alert alert-error py-2 text-sm"><span>{error}</span></div>}

          <button type="submit" className="btn btn-primary w-full btn-lg" style={{ backgroundColor: brandColor, borderColor: brandColor }} disabled={loading}>
            {loading ? <span className="loading loading-spinner" /> : "Send my testimonial ✦"}
          </button>
        </form>
      </div>
    </div>
  )
}
