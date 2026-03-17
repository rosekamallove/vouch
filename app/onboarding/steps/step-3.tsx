"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Copy, Check, Mail, Twitter, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { advanceOnboardingStep } from "../actions"

const SHARE_METHODS = [
  { Icon: Mail, label: "Email" },
  { Icon: Twitter, label: "Twitter / X" },
  { Icon: Code2, label: "Embed" },
]

export default function Step3({
  slug,
  onNext,
}: {
  slug: string
  onNext: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://vouch.so"
  const url = `${origin}/collect/${slug}`

  function handleCopy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  function handleNext() {
    startTransition(async () => {
      await advanceOnboardingStep(3)
      onNext()
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
          Share your collection link
        </h1>
        <p className="text-white/40 text-[15px] leading-relaxed">
          Send this to your users — they&apos;ll land on a beautiful form to
          leave a testimonial.
        </p>
      </div>

      <div className="space-y-4">
        {/* Copy URL row */}
        <div className="flex gap-2">
          <input
            readOnly
            value={url}
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/50 text-sm font-mono focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm font-medium transition-all whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 shrink-0" />
                Copy link
              </>
            )}
          </button>
        </div>

        {/* Share method tiles */}
        <div className="grid grid-cols-3 gap-2">
          {SHARE_METHODS.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] cursor-default transition-all group"
            >
              <Icon className="w-4 h-4 text-white/35 group-hover:text-white/55 transition-colors" />
              <span className="text-white/40 text-xs font-medium group-hover:text-white/60 transition-colors text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={isPending}
        size="lg"
        className="w-full text-base hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        {isPending ? (
          <span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  )
}
