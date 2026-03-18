import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Star,
  Zap,
  Shield,
  Code2,
  CheckCircle2,
  MessageSquareQuote,
  Layers,
} from "lucide-react"

/* ─────────────────────────────────────────────
   Inline sub-components (no extra files needed)
───────────────────────────────────────────── */

function NavBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-primary font-bold text-lg tracking-tight">Vouch</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" className="gap-1.5" asChild>
            <Link href="/sign-up">
              Get started free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

/* Floating testimonial cards used in hero visual */
function TestimonialCardMini({
  name,
  role,
  text,
  rating,
  delay,
  className,
}: {
  name: string
  role: string
  text: string
  rating: number
  delay?: string
  className?: string
}) {
  return (
    <div
      className={`absolute bg-card border border-border rounded-2xl p-4 shadow-2xl backdrop-blur-sm w-64 animate-float ${className}`}
      style={{ animationDelay: delay ?? "0s" }}
    >
      <StarRating rating={rating} />
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">{text}</p>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
          {name[0]}
        </div>
        <div>
          <p className="text-xs font-medium leading-none">{name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{role}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <NavBar />

      {/* ── 1. HERO ─────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
              API-first testimonial platform
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-delay-1 text-5xl sm:text-6xl font-extrabold tracking-tighter leading-[1.04]">
              Your users love
              <br />
              your product.
              <br />
              <span className="text-muted-foreground">Let the world know.</span>
            </h1>

            {/* Supporting copy */}
            <p className="animate-fade-up-delay-2 text-lg text-muted-foreground leading-relaxed max-w-md">
              Vouch gives you a beautiful, brandable form your customers actually enjoy filling out —
              and a clean REST API to display that social proof anywhere. No widgets. No copy-pasting.
              Just real testimonials, on demand.
            </p>

            {/* Subheading */}
            <p className="animate-fade-up-delay-2 text-sm text-foreground/70 font-medium max-w-sm">
              From first submission to live on your site in under five minutes.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2 text-sm font-semibold px-6" asChild>
                <Link href="/sign-up">
                  Start collecting free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-sm px-6" asChild>
                <a href="#how">See how it works</a>
              </Button>
            </div>

            {/* Trust line */}
            <div className="animate-fade-up-delay-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Free forever tier
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Up in 2 minutes
              </span>
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative h-[520px] hidden lg:block">
            {/* Glow blob */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />
            </div>

            {/* Dashboard mockup placeholder */}
            <div className="absolute inset-8 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Mockup top bar */}
              <div className="border-b border-border px-4 py-3 flex items-center gap-2 bg-muted/30">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background/60 rounded-md px-3 py-1 text-[10px] text-muted-foreground font-mono">
                    vouch.app/dashboard/my-saas
                  </div>
                </div>
              </div>
              {/* Mockup content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold">Testimonials</div>
                  <div className="flex gap-1.5">
                    {["Pending", "Approved", "Rejected"].map((t, i) => (
                      <span
                        key={t}
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          i === 1
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Mini cards */}
                {[
                  { name: "Sarah K.", role: "Founder, Loops", text: "Cut our onboarding time by half. The API is insanely clean.", rating: 5 },
                  { name: "Tom R.", role: "Lead Dev, Cron", text: "Finally a tool that treats devs like adults.", rating: 5 },
                  { name: "Priya M.", role: "CEO, Rayform", text: "Set it up in 3 minutes. My testimonials section updates itself now.", rating: 5 },
                ].map((t) => (
                  <div key={t.name} className="bg-background/50 border border-border rounded-xl p-3 space-y-1.5">
                    <StarRating rating={t.rating} />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{t.text}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="text-[10px] font-medium">{t.name}</p>
                        <p className="text-[9px] text-muted-foreground">{t.role}</p>
                      </div>
                      <div className="ml-auto flex gap-1">
                        <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full">
                          Approve
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -right-4 top-16 animate-float bg-card border border-border rounded-xl px-3 py-2 shadow-xl text-xs font-mono text-muted-foreground" style={{ animationDelay: "0.5s" }}>
              <span className="text-green-400">GET</span> /api/v1/testimonials/<span className="text-primary">my-saas</span>
            </div>
            <div className="absolute -left-4 bottom-20 animate-float bg-card border border-border rounded-xl px-3 py-2 shadow-xl text-xs" style={{ animationDelay: "1.5s" }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
                <span className="text-muted-foreground font-mono">3 new this week</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. LOGO STRIP / SOCIAL PROOF (light) ────── */}
      <section className="border-y border-border px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs text-muted-foreground font-medium mb-6 uppercase tracking-widest">
            Trusted by indie hackers and founders at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50 grayscale">
            {/* Placeholder logos — replace with real SVGs */}
            {["Acme Corp", "Loops", "Cron", "Rayform", "Linear", "Vercel"].map((name) => (
              <span key={name} className="text-sm font-bold tracking-tight text-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ──────────────────────────────── */}
      <section id="features" className="px-6 py-28 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1 text-xs font-medium text-muted-foreground">
            Features
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
            Built for developers who want control, speed, and clean abstractions —
            not another drag-and-drop widget nightmare.
          </p>
        </div>

        {/* Bento feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">

          {/* Card 1 — API-first (tall, spans 2 rows on lg) */}
          <div className="lg:row-span-2 rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/8 to-transparent p-6 flex flex-col gap-6 overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                <Code2 className="w-3.5 h-3.5" /> Core
              </div>
              <h3 className="text-xl font-bold tracking-tight">API-first, always</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                One authenticated GET request returns your approved testimonials as clean JSON.
                Render them however you like — Next.js, Framer, Webflow, raw HTML. You own the output.
              </p>
            </div>
            {/* Mini terminal */}
            <div className="flex-1 rounded-xl bg-zinc-950 border border-white/[0.07] overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-red-400/50" />
                <span className="w-2 h-2 rounded-full bg-yellow-400/50" />
                <span className="w-2 h-2 rounded-full bg-green-400/50" />
              </div>
              <div className="p-4 font-mono text-xs leading-6 space-y-0.5">
                <div className="text-zinc-500">$ curl vouch.app/api/v1/testimonials/</div>
                <div className="text-zinc-500 pl-4">my-saas \</div>
                <div className="text-zinc-500 pl-4">
                  -H <span className="text-green-400">&quot;Authorization: Bearer sk_••••&quot;</span>
                </div>
                <div className="mt-2 text-zinc-400">{"{"}</div>
                <div className="pl-4">
                  <span className="text-blue-300">&quot;count&quot;</span>
                  <span className="text-zinc-400">{": "}</span>
                  <span className="text-yellow-300">{"12"}</span>
                  <span className="text-zinc-400">{","}</span>
                </div>
                <div className="pl-4">
                  <span className="text-blue-300">&quot;testimonials&quot;</span>
                  <span className="text-zinc-400">{": ["}</span>
                </div>
                <div className="pl-8">
                  <span className="text-zinc-400">{"{ "}</span>
                  <span className="text-blue-300">&quot;rating&quot;</span>
                  <span className="text-zinc-400">{": "}</span>
                  <span className="text-yellow-300">{"5"}</span>
                  <span className="text-zinc-400">{","}</span>
                </div>
                <div className="pl-10">
                  <span className="text-blue-300">&quot;text&quot;</span>
                  <span className="text-zinc-400">{": "}</span>
                  <span className="text-green-400">&quot;Game changer...&quot;</span>
                  <span className="text-zinc-400">{" }"}</span>
                </div>
                <div className="pl-4 text-zinc-400">{"]"}</div>
                <div className="text-zinc-400">{"}"}</div>
              </div>
            </div>
          </div>

          {/* Card 2 — Collection form */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 overflow-hidden group hover:border-border/60 hover:-translate-y-0.5 transition-all">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <MessageSquareQuote className="w-3.5 h-3.5" /> Collect
              </div>
              <h3 className="text-lg font-bold tracking-tight">Beautiful collection forms</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A branded page your customers actually enjoy. Photo upload, star rating, video — done in under a minute.
              </p>
            </div>
            {/* Mini form preview */}
            <div className="rounded-xl border border-border bg-background/60 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center text-[9px] text-muted-foreground">+</div>
                <div className="flex-1 space-y-1">
                  <div className="h-5 rounded-md bg-muted/70 w-full" />
                  <div className="h-5 rounded-md bg-muted/70 w-3/4" />
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 5 ? "fill-primary text-primary" : ""}`} />
                ))}
              </div>
              <div className="h-12 rounded-md bg-muted/70 w-full" />
              <div className="h-7 rounded-lg bg-primary w-full flex items-center justify-center">
                <span className="text-[10px] font-semibold text-primary-foreground">Submit testimonial</span>
              </div>
            </div>
          </div>

          {/* Card 3 — Approval workflow */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 overflow-hidden group hover:border-border/60 hover:-translate-y-0.5 transition-all">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Shield className="w-3.5 h-3.5" /> Control
              </div>
              <h3 className="text-lg font-bold tracking-tight">You approve. Nothing else goes live.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every submission hits your queue first. Approve the gems, reject the noise.
              </p>
            </div>
            {/* Mini approval queue */}
            <div className="space-y-2">
              {[
                { name: "Sarah K.", text: "Absolutely love it.", approved: true },
                { name: "Bot User", text: "CLICK HERE WIN PRIZE", approved: false },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-2.5 py-2">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0">
                    {item.name[0]}
                  </div>
                  <p className="text-[11px] text-muted-foreground flex-1 truncate">{item.text}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium shrink-0 ${
                    item.approved
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {item.approved ? "Approved" : "Rejected"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4 — Video (wide, spans 2 cols on md+) */}
          <div className="md:col-span-2 lg:col-span-1 rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 overflow-hidden group hover:border-border/60 hover:-translate-y-0.5 transition-all">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Zap className="w-3.5 h-3.5" /> Media
              </div>
              <h3 className="text-lg font-bold tracking-tight">Video testimonials, built in</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Record in-browser or upload an MP4. Video converts harder than text — and your customers don&apos;t need to leave the form.
              </p>
            </div>
            {/* Video UI mockup */}
            <div className="rounded-xl border border-border bg-zinc-950 aspect-video flex flex-col items-center justify-center gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10" />
              <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white/60 ml-0.5" />
              </div>
              <p className="text-[11px] text-white/40 font-mono">recording • 0:42</p>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white/20 rounded-full"
                    style={{ height: `${4 + Math.sin(i * 0.8) * 6 + 6}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 5 — Custom branding */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 overflow-hidden group hover:border-border/60 hover:-translate-y-0.5 transition-all">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Layers className="w-3.5 h-3.5" /> Brand
              </div>
              <h3 className="text-lg font-bold tracking-tight">Looks like yours, not ours</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Logo, color, headline — the collection page lives under your brand.
              </p>
            </div>
            {/* Color swatch + preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"].map((color) => (
                  <div
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-white/10 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="ml-auto text-[10px] text-muted-foreground font-mono">#f59e0b</div>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-2.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-amber-400/80" />
                  <span className="text-[11px] font-semibold">my-saas</span>
                </div>
                <div className="h-2 rounded bg-amber-400/30 w-3/4 mb-1" />
                <div className="h-2 rounded bg-muted/60 w-1/2" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────── */}
      <section id="how" className="px-6 py-28 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1 text-xs font-medium text-muted-foreground">
              How it works
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">
              Up and running
              <br />
              <span className="text-muted-foreground">in three steps.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {[
              {
                step: "01",
                title: "Create a project",
                desc: "Sign up, name your project, and get a shareable collection link plus a secret API key — in under two minutes.",
                code: "vouch.app/collect/my-saas",
              },
              {
                step: "02",
                title: "Share the link",
                desc: "Drop it in your onboarding email, Slack, or footer. Customers fill a beautiful form — no account needed on their end.",
                code: "reply.email → collect link",
              },
              {
                step: "03",
                title: "Approve & ship",
                desc: "Review in your dashboard. Approve the good ones. Hit the API and your site's testimonials update themselves.",
                code: "GET /api/v1/testimonials/my-saas",
              },
            ].map(({ step, title, desc, code }) => (
              <div key={step} className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center text-xs font-mono font-bold text-primary">
                    {step}
                  </div>
                  <h3 className="font-semibold text-base">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-11">{desc}</p>
                <div className="ml-11 bg-zinc-900 dark:bg-zinc-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-400">
                  {code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SOCIAL PROOF (testimonials) ───────────── */}
      <section className="px-6 py-28 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Don&apos;t take our word for it.
            </h2>
            <p className="text-muted-foreground text-base">
              Here&apos;s what early users are saying — collected with Vouch, obviously.
            </p>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {[
              { name: "Alex Chen", role: "Founder, Formbase", text: "I was spending 20 minutes a week copy-pasting testimonials from Slack into Notion. Vouch killed that entirely. Set it up once, it just works.", rating: 5 },
              { name: "Jamie Torres", role: "Solo dev", text: "The API response is exactly what I want. Clean, typed, predictable. I can slot it into any framework without adapters or SDK nonsense.", rating: 5 },
              { name: "Mia Okafor", role: "Head of Marketing, Cron", text: "Our testimonials page used to be months out of date. Now it's live, current, and takes zero effort to maintain.", rating: 5 },
              { name: "Sam Whitfield", role: "Indie hacker", text: "I tried Senja and Testimonial.to. Both felt like they were designed for people who've never written a line of code. Vouch actually gets it.", rating: 5 },
              { name: "Priya Nair", role: "CTO, Pocketflow", text: "Took me 4 minutes to go from signup to seeing my first testimonial in production. The onboarding is stupidly smooth.", rating: 5 },
              { name: "Ryan Park", role: "Developer, Rayform", text: "Video testimonials in the browser, approval workflow, and an API — I can't believe this is free to start.", rating: 5 },
            ].map((t) => (
              <div
                key={t.name}
                className="break-inside-avoid bg-card border border-border rounded-2xl p-5 space-y-3 hover:border-border/80 transition-colors"
              >
                <StarRating rating={t.rating} />
                <p className="text-sm text-foreground/80 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-none">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. BENEFITS ──────────────────────────────── */}
      <section className="border-t border-border">

        {/* ── Benefit 1: text left, image right ── */}
        <div className="px-6 py-24 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1 text-xs font-medium text-muted-foreground">
                Benefits
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight leading-[1.1]">
                Your testimonials
                <br />
                section, on autopilot.
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                You built something people love. That story should be on your homepage —
                always fresh, always accurate, never a manual task.
              </p>
              <ul className="space-y-5">
                {[
                  { title: "Always current", desc: "New approvals appear instantly. Your site reflects reality, not last month's copy-paste session." },
                  { title: "Zero maintenance", desc: "No Notion databases. No spreadsheets. No \"I'll update the testimonials page this weekend\" guilt." },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual — approval queue mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-xs text-muted-foreground font-mono">vouch.app/dashboard</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold">Pending review</p>
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">3 new</span>
                  </div>
                  {[
                    { name: "Alex C.", role: "Founder", text: "Cut our onboarding time by half.", rating: 5, color: "bg-violet-400/20 text-violet-400" },
                    { name: "Jamie T.", role: "Solo dev", text: "The API is insanely clean.", rating: 5, color: "bg-blue-400/20 text-blue-400" },
                    { name: "Mia O.", role: "Head of Mktg", text: "Zero effort to maintain now.", rating: 5, color: "bg-emerald-400/20 text-emerald-400" },
                  ].map((t, i) => (
                    <div key={t.name} className="flex items-start gap-3 bg-background/60 border border-border rounded-xl p-3" style={{ opacity: 1 - i * 0.15 }}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.color}`}>
                        {t.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <StarRating rating={t.rating} />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed truncate">{t.text}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{t.name} · {t.role}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md">✓</button>
                        <button className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Benefit 2: image left, text right ── */}
        <div className="px-6 py-24 border-t border-border bg-muted/20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Visual — collection form mockup */}
              <div className="relative order-last lg:order-first">
                <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    <span className="ml-3 text-xs text-muted-foreground font-mono">vouch.app/collect/my-saas</span>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Branded header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">M</div>
                      <div>
                        <p className="text-xs font-semibold">Share your experience</p>
                        <p className="text-[10px] text-muted-foreground">my-saas · powered by Vouch</p>
                      </div>
                    </div>
                    {/* Photo upload */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-[10px] text-center leading-tight">
                        Add<br />photo
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="h-7 bg-muted/60 rounded-lg px-2.5 flex items-center text-[11px] text-muted-foreground">Your name</div>
                        <div className="h-7 bg-muted/60 rounded-lg px-2.5 flex items-center text-[11px] text-muted-foreground">Role / Company</div>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                      ))}
                    </div>
                    {/* Textarea */}
                    <div className="h-20 bg-muted/60 rounded-lg p-2.5 text-[11px] text-muted-foreground leading-relaxed">
                      This product is honestly incredible. I can&apos;t believe how much time it saves…
                    </div>
                    <div className="h-8 bg-primary rounded-lg flex items-center justify-center text-[11px] font-semibold text-primary-foreground">
                      Submit testimonial
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1 text-xs font-medium text-muted-foreground">
                  Benefits
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight leading-[1.1]">
                  You own the data.
                  <br />
                  <span className="text-muted-foreground">Every bit of it.</span>
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  No widgets. No iframes you can&apos;t control. You get raw JSON from a single
                  API call — render it in your design system, your components, your way.
                </p>
                <ul className="space-y-5">
                  {[
                    { title: "You own the data", desc: "It's JSON. Use it however you want — render it your way, in your design system, with your components." },
                    { title: "Spam-free by default", desc: "Every submission is moderated. Rate limiting and honeypots filter bots before they reach your queue." },
                  ].map(({ title, desc }) => (
                    <li key={title} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Benefit 3: text left, image right ── */}
        <div className="px-6 py-24 border-t border-border max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1 text-xs font-medium text-muted-foreground">
                Benefits
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight leading-[1.1]">
                One API call.
                <br />
                <span className="text-muted-foreground">Live everywhere.</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Drop a single fetch into your site. Every time a testimonial gets approved,
                it appears — no deploys, no manual updates, no stale copy.
              </p>
              <ul className="space-y-5">
                {[
                  { title: "Framework agnostic", desc: "Next.js, Remix, SvelteKit, plain HTML — it's a fetch call. It works everywhere." },
                  { title: "Always up to date", desc: "Approve a testimonial in your dashboard and it's live on your site on the next page load. No intervention needed." },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual — code block */}
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl bg-zinc-950 dark:bg-zinc-900/80 border border-white/[0.08] overflow-hidden shadow-2xl">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-xs text-zinc-500 font-mono">testimonials.tsx</span>
                </div>
                <div className="p-5 text-sm font-mono leading-7 space-y-1">
                  <div className="text-zinc-500">{"// fetch once, render anywhere"}</div>
                  <div>
                    <span className="text-blue-400">{"const"}</span>
                    <span className="text-zinc-200">{" res "}</span>
                    <span className="text-zinc-400">{"= "}</span>
                    <span className="text-blue-400">{"await "}</span>
                    <span className="text-yellow-300">{"fetch"}</span>
                    <span className="text-zinc-400">{"("}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-green-400">{"\"/api/v1/testimonials/my-saas\""}</span>
                    <span className="text-zinc-400">{","}</span>
                  </div>
                  <div className="pl-4 text-zinc-400">{"{"}</div>
                  <div className="pl-8">
                    <span className="text-zinc-300">{"headers"}</span>
                    <span className="text-zinc-400">{": {"}</span>
                  </div>
                  <div className="pl-12">
                    <span className="text-zinc-300">{"Authorization"}</span>
                    <span className="text-zinc-400">{": "}</span>
                    <span className="text-green-400">{"\"Bearer \" + process.env.VOUCH_KEY"}</span>
                  </div>
                  <div className="pl-8 text-zinc-400">{"}"}</div>
                  <div className="pl-4 text-zinc-400">{"}"}</div>
                  <div className="text-zinc-400">{")"}</div>
                  <div className="mt-2">
                    <span className="text-blue-400">{"const"}</span>
                    <span className="text-zinc-200">{" { testimonials } "}</span>
                    <span className="text-zinc-400">{"= "}</span>
                    <span className="text-blue-400">{"await "}</span>
                    <span className="text-zinc-200">{"res"}</span>
                    <span className="text-zinc-400">{"."}</span>
                    <span className="text-yellow-300">{"json"}</span>
                    <span className="text-zinc-400">{"()"}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/[0.06] text-zinc-500">{"// ↓ your site. your design."}</div>
                  <div>
                    <span className="text-blue-400">{"return"}</span>
                    <span className="text-zinc-200">{" testimonials."}</span>
                    <span className="text-yellow-300">{"map"}</span>
                    <span className="text-zinc-400">{"(t => ("}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-400">{"<"}</span>
                    <span className="text-red-400">{"YourCard"}</span>
                    <span className="text-zinc-300">{" quote"}</span>
                    <span className="text-zinc-400">{"={t."}</span>
                    <span className="text-blue-300">{"text"}</span>
                    <span className="text-zinc-400">{"} />"}</span>
                  </div>
                  <div className="text-zinc-400">{"  ))"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── 8. REINFORCING STATEMENT + FINAL CTA ─────── */}
      <section className="px-6 py-32 border-t border-border relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-primary/8 blur-3xl rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-8 relative">
          <h2 className="text-5xl font-extrabold tracking-tighter leading-[1.05]">
            Your users are
            <br />
            already your best
            <br />
            <span className="text-primary">marketing team.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Stop letting those stories live in DMs and Slack threads.
            Give them a home — and let them do the selling for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2 text-sm font-semibold px-8" asChild>
              <Link href="/sign-up">
                Start collecting free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No credit card. No widgets. Just an API.
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight">Vouch</span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">Sign up</Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Vouch</span>
        </div>
      </footer>
    </div>
  )
}
