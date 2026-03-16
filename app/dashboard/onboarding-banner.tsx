"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Step = { label: string; done: boolean }

export default function OnboardingBanner({
  steps,
}: {
  steps: Step[]
  onAdvance?: () => void
}) {
  const [dismissed, setDismissed] = useState(false)
  const completedCount = steps.filter((s) => s.done).length

  if (dismissed || completedCount === steps.length) return null

  return (
    <div className="rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 p-5 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <p className="font-semibold text-sm">Get started with Vouch</p>
          <p className="text-xs text-muted-foreground">{completedCount} of {steps.length} steps complete</p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 -mt-1 -mr-1 h-7 w-7" onClick={() => setDismissed(true)}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ol className="flex flex-col sm:flex-row gap-3 mt-4">
        {steps.map((step, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <span className={cn(
              "w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 transition-colors",
              step.done
                ? "bg-yellow-500 text-white"
                : "border-2 border-border text-muted-foreground"
            )}>
              {step.done ? <Check className="w-3 h-3" /> : i + 1}
            </span>
            <span className={cn("text-xs", step.done ? "text-foreground font-medium" : "text-muted-foreground")}>
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <span className="hidden sm:block w-8 h-px bg-border shrink-0" />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
