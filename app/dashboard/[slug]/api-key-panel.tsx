"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function ApiKeyPanel({
  projectId,
  apiKey: initialKey,
  slug,
}: {
  projectId: string
  apiKey: string
  slug: string
}) {
  const [apiKey, setApiKey] = useState(initialKey)
  const [regenerating, setRegenerating] = useState(false)
  const [revealed, setRevealed] = useState(false)

  async function regenerate() {
    setRegenerating(true)
    const res = await fetch(`/api/projects/${projectId}/regenerate-key`, { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      setApiKey(data.apiKey)
      setRevealed(true)
      toast.success("API key regenerated")
    } else {
      toast.error("Failed to regenerate key")
    }
    setRegenerating(false)
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey)
    toast.success("Copied to clipboard")
  }

  function copyExample() {
    const base = window.location.origin
    const cmd = `curl ${base}/api/v1/testimonials/${slug} \\\n  -H "Authorization: Bearer ${apiKey}"`
    navigator.clipboard.writeText(cmd)
    toast.success("curl command copied")
  }

  const displayKey = revealed ? apiKey : `${apiKey.slice(0, 8)}${"•".repeat(24)}`

  return (
    <div className="card bg-base-200 border border-base-300">
      <div className="card-body py-3 px-4 space-y-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs font-mono text-base-content/60 truncate">{displayKey}</code>
          <button onClick={() => setRevealed((r) => !r)} className="btn btn-ghost btn-xs text-base-content/50">
            {revealed ? "Hide" : "Reveal"}
          </button>
          <div className="w-px h-4 bg-base-300 shrink-0" />
          <button className="btn btn-outline btn-xs" onClick={copyKey}>Copy key</button>
        </div>
        <div className="divider my-0" />
        <div className="flex items-center justify-between gap-4">
          <code className="text-xs font-mono text-base-content/50 truncate">
            GET /api/v1/testimonials/{slug}
          </code>
          <div className="flex items-center gap-2 shrink-0">
            <button className="btn btn-ghost btn-xs" onClick={copyExample}>Copy curl</button>
            <button className="btn btn-ghost btn-xs text-error hover:text-error" onClick={regenerate} disabled={regenerating}>
              {regenerating ? <span className="loading loading-spinner loading-xs" /> : "Regenerate key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
