"use client"

import { useState } from "react"
import Step1 from "./steps/step-1"
import Step2 from "./steps/step-2"
import Step3 from "./steps/step-3"
import Step4 from "./steps/step-4"

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEP_META = [
  { title: "Social proof\nthat converts." },
  { title: "Create your\nworkspace." },
  { title: "Reach your\nusers." },
  { title: "You're\nready." },
] as const

// ─── Illustrations — all use currentColor so they inherit --color-primary ─────

function RadarArt() {
  return (
    <svg
      className="w-56 h-56 animate-radar-pulse"
      viewBox="0 0 200 200"
      fill="none"
      style={{ color: "var(--color-primary)" }}
    >
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1" opacity="0.65" />
      <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="0.75" opacity="0.38" />
      <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
    </svg>
  )
}

function CardsArt() {
  return (
    <svg
      className="w-56 h-56 animate-card-float"
      viewBox="0 0 200 200"
      fill="none"
      style={{ color: "var(--color-primary)" }}
    >
      <rect x="60" y="42" width="105" height="76" rx="7" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      <rect x="35" y="64" width="112" height="82" rx="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" opacity="0.9" />
      <circle cx="64" cy="82" r="9" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <line x1="82" y1="78" x2="132" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <line x1="82" y1="87" x2="118" y2="87" stroke="currentColor" strokeWidth="0.75" opacity="0.28" />
      <line x1="52" y1="104" x2="132" y2="104" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      <line x1="52" y1="116" x2="110" y2="116" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <line x1="52" y1="128" x2="120" y2="128" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
    </svg>
  )
}

function ShareArt() {
  return (
    <svg
      className="w-56 h-56"
      viewBox="0 0 200 200"
      fill="none"
      style={{ color: "var(--color-primary)" }}
    >
      <circle cx="52" cy="100" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.85" className="animate-share-pulse" />
      <circle cx="148" cy="100" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
      <line x1="71" y1="100" x2="117" y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.45" strokeDasharray="4 3" />
      <polyline points="110,93 117,100 110,107" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
      <circle cx="148" cy="58" r="10" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="148" cy="142" r="10" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="148" y1="119" x2="148" y2="132" stroke="currentColor" strokeWidth="1" opacity="0.25" strokeDasharray="3 2" />
      <line x1="148" y1="68" x2="148" y2="81" stroke="currentColor" strokeWidth="1" opacity="0.25" strokeDasharray="3 2" />
    </svg>
  )
}

function StarArt() {
  return (
    <svg
      className="w-56 h-56 animate-star-burst"
      viewBox="0 0 200 200"
      fill="none"
      style={{ color: "var(--color-primary)" }}
    >
      <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <polygon
        points="100,28 116,72 163,72 126,97 142,141 100,116 58,141 74,97 37,72 84,72"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.07"
        opacity="0.9"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="100" r="5" fill="currentColor" opacity="0.8" />
      <circle cx="100" cy="53" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="141" cy="130" r="1.5" fill="currentColor" opacity="0.38" />
      <circle cx="59" cy="130" r="1.5" fill="currentColor" opacity="0.38" />
    </svg>
  )
}

const ARTS = [RadarArt, CardsArt, ShareArt, StarArt]

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({ step }: { step: number }) {
  const meta = STEP_META[step - 1]
  const Art = ARTS[step - 1]

  return (
    <div
      className="hidden md:flex relative flex-col w-[45%] overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: 0.055,
          mixBlendMode: "overlay",
        }}
      />

      {/* Faint oversized step number */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span
          className="select-none font-black leading-none"
          style={{
            fontSize: "22rem",
            color: "rgba(255,255,255,0.03)",
            fontFamily: "var(--font-dm-serif)",
          }}
        >
          {step}
        </span>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <Art />
      </div>

      {/* Bottom content */}
      <div className="relative z-10 px-12 pb-12">
        {/* Primary accent line */}
        <div className="w-10 h-[2px] bg-primary mb-5 opacity-80" />

        {/* Step title */}
        <h2
          className="text-white/88 mb-8 leading-tight"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(1.75rem, 2.4vw, 2.4rem)",
            whiteSpace: "pre-line",
          }}
        >
          {meta.title}
        </h2>

        {/* Progress dots */}
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className={`rounded-full transition-all duration-300 ${
                dot === step
                  ? "bg-primary"
                  : dot < step
                    ? "bg-primary/40"
                    : "bg-white/20"
              }`}
              style={{
                width: dot === step ? "20px" : "6px",
                height: "6px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

type Props = {
  initialStep: number
  initialSlug: string
  userName: string
}

export function OnboardingShell({ initialStep, initialSlug }: Props) {
  const [step, setStep] = useState(initialStep)
  const [slug, setSlug] = useState(initialSlug)
  const [animKey, setAnimKey] = useState(0)

  function goToStep(newStep: number, newSlug?: string) {
    if (newSlug) setSlug(newSlug)
    setAnimKey((k) => k + 1)
    setStep(newStep)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <LeftPanel step={step} />

      <div className="flex flex-col flex-1" style={{ background: "#111111" }}>
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-6 pt-8 pb-2">
          <div className="w-8 h-[2px] bg-primary opacity-80" />
          <span className="text-white/35 text-xs tracking-widest uppercase font-medium">
            Step {step} of 4
          </span>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div
            key={animKey}
            className="w-full max-w-[420px] animate-slide-from-right"
          >
            {step === 1 && <Step1 onNext={() => goToStep(2)} />}
            {step === 2 && <Step2 onNext={(s) => goToStep(3, s)} />}
            {step === 3 && <Step3 slug={slug} onNext={() => goToStep(4)} />}
            {step === 4 && <Step4 />}
          </div>
        </div>
      </div>
    </div>
  )
}
