"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
    <div className="rounded-lg border bg-card divide-y">
      {/* API key row */}
      <div className="px-4 py-3 flex items-center gap-2">
        <code className="flex-1 text-xs font-mono text-muted-foreground truncate">{displayKey}</code>
        <button
          onClick={() => setRevealed((r) => !r)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          {revealed ? "Hide" : "Reveal"}
        </button>
        <div className="w-px h-4 bg-border shrink-0" />
        <Button variant="outline" size="sm" onClick={copyKey} className="shrink-0 h-7 text-xs">
          Copy key
        </Button>
      </div>

      {/* curl example row */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <code className="text-xs font-mono text-muted-foreground truncate">
          GET /api/v1/testimonials/{slug}
        </code>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={copyExample}>
            Copy curl
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/5"
            onClick={regenerate}
            disabled={regenerating}
          >
            {regenerating ? "Regenerating…" : "Regenerate key"}
          </Button>
        </div>
      </div>
    </div>
  )
}
