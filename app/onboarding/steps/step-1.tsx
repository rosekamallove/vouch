"use client"

import { useTransition } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { advanceOnboardingStep } from "../actions"

export default function Step1({ onNext }: { onNext: () => void }) {
  const [isPending, startTransition] = useTransition()

  function handleNext() {
    startTransition(async () => {
      await advanceOnboardingStep(1)
      onNext()
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
          Your social proof,
          <br />
          <em className="text-primary">beautifully organized.</em>
        </h1>
        <p className="text-white/40 text-[15px] leading-relaxed max-w-sm">
          Vouch helps you collect, curate, and display testimonials from real
          users. Let&apos;s get you set up in 3 steps.
        </p>
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
            Let&apos;s go
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  )
}
