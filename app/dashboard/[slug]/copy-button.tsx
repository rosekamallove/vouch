"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CopyButton({ text, advanceOnboarding }: { text: string; advanceOnboarding?: boolean }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)

    if (advanceOnboarding) {
      fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2 }),
      }).catch(() => {})
    }
  }

  return (
    <Button variant="ghost" size="icon-xs" onClick={copy} title="Copy link">
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </Button>
  )
}
