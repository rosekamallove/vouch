"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { completeOnboarding } from "../actions"

const CHECKLIST = [
  "Project created",
  "Collection link ready",
  "Dashboard configured",
]

export default function Step4() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDone() {
    startTransition(async () => {
      await completeOnboarding()
      router.push("/dashboard")
    })
  }

  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <h1
          className="text-white/95 leading-[1.1]"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
          }}
        >
          Vouch is <em className="text-primary">ready.</em>
        </h1>
        <p className="text-white/40 text-[15px] leading-relaxed max-w-sm">
          Head to your dashboard to review testimonials as they come in. You can
          always come back to these settings.
        </p>
      </div>

      <div className="space-y-1">
        {CHECKLIST.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-3.5 py-2.5 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-white/45 text-sm">{item}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={handleDone}
        disabled={isPending}
        size="lg"
        className="w-full text-base hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        {isPending ? (
          <span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
        ) : (
          <>
            Go to dashboard
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  )
}
