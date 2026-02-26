"use client"

import { useState } from "react"

type Step = { label: string; done: boolean }

export default function OnboardingBanner({
  steps,
  onAdvance,
}: {
  steps: Step[]
  onAdvance?: () => void
}) {
  const [dismissed, setDismissed] = useState(false)
  const completedCount = steps.filter((s) => s.done).length

  if (dismissed || completedCount === steps.length) return null

  return (
    <div className="card bg-primary/10 border border-primary/30 animate-slide-up">
      <div className="card-body py-4 px-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-sm">Get started with Vouch</p>
            <p className="text-xs text-base-content/60 mt-0.5">{completedCount} of {steps.length} steps complete</p>
          </div>
          <button
            className="btn btn-ghost btn-xs text-base-content/40"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>

        <ul className="steps steps-vertical sm:steps-horizontal w-full mt-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className={`step text-xs ${step.done ? "step-primary" : ""}`}
            >
              {step.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
