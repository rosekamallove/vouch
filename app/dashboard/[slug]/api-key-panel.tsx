"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Eye, EyeOff, Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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
    <div className="rounded-xl border border-border p-5 space-y-4">
      {/* Key row */}
      <div className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2.5">
        <code className="flex-1 text-xs font-mono text-muted-foreground truncate">{displayKey}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRevealed((r) => !r)}
          className="shrink-0 h-auto py-1 px-2 text-xs text-muted-foreground"
        >
          {revealed ? <><EyeOff className="w-3.5 h-3.5 mr-1" /> Hide</> : <><Eye className="w-3.5 h-3.5 mr-1" /> Reveal</>}
        </Button>
        <div className="w-px h-4 bg-border shrink-0" />
        <Button variant="outline" size="sm" onClick={copyKey} className="shrink-0 h-auto py-1 px-2 text-xs gap-1.5">
          <Copy className="w-3 h-3" /> Copy key
        </Button>
      </div>

      <Separator />

      {/* Endpoint row */}
      <div className="flex items-center justify-between gap-4">
        <code className="text-xs font-mono text-muted-foreground truncate">
          GET /api/v1/testimonials/{slug}
        </code>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={copyExample} className="text-xs h-auto py-1 px-2">
            Copy curl
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={regenerate}
            disabled={regenerating}
            className="text-xs h-auto py-1 px-2 text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            {regenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Regenerate key"}
          </Button>
        </div>
      </div>
    </div>
  )
}
