import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Layers, Inbox, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="font-bold tracking-tight text-lg">Vouch</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">Get started free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-28 gap-8 max-w-4xl mx-auto w-full animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
          Built for developers and indie hackers
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tighter leading-[1.05] max-w-3xl">
          Stop copy-pasting
          <br />
          <span className="text-foreground/70">testimonials.</span>
        </h1>

        <p className="text-muted-foreground text-xl max-w-lg leading-relaxed">
          Give users a beautiful form to share their story. You get a clean REST API to display social proof anywhere — in minutes, not days.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="text-base px-8" asChild>
            <Link href="/sign-up">Start collecting — it&apos;s free</Link>
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8" asChild>
            <Link href="#how">See how it works</Link>
          </Button>
        </div>

        {/* Code block */}
        <div className="mt-4 w-full max-w-xl text-left bg-zinc-900 dark:bg-zinc-800 rounded-2xl p-5 text-sm font-mono shadow-xl">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="text-zinc-500 text-xs mb-1"># one curl call to rule them all</div>
          <div className="text-zinc-200 leading-7">
            curl https://vouch.app/api/v1/testimonials/<span className="text-yellow-400">my-saas</span> \
            <br />
            {"  "}-H <span className="text-green-400">&quot;Authorization: Bearer sk_••••••••&quot;</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border px-6 py-24">
        <div className="max-w-4xl mx-auto space-y-14">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dead simple by design</h2>
            <p className="text-muted-foreground">Three steps. No fluff.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Layers className="w-7 h-7 text-foreground/60" />, step: "01", title: "Create a project", desc: "Sign up, name your project, and get a shareable collection link + a secret API key. Takes under two minutes." },
              { icon: <Inbox className="w-7 h-7 text-foreground/60" />, step: "02", title: "Let the love roll in", desc: "Drop the link in your onboarding email or Slack. Users fill a friendly form — name, photo, rating, their story." },
              { icon: <Zap className="w-7 h-7 text-foreground/60" />, step: "03", title: "Approve & ship", desc: "Review submissions in your dashboard, approve the good ones, and hit the API from your website. Done." },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="rounded-xl bg-muted/50 border border-border p-6 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-4">
                  {icon}
                  <span className="text-xs font-mono text-muted-foreground font-bold">{step}</span>
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Your users love your product.
            <br />
            <span className="text-muted-foreground">Let them prove it.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Free to start. No credit card. No widgets. Just an API.
          </p>
          <Button size="lg" className="text-base px-10" asChild>
            <Link href="/sign-up">Get started — it&apos;s free</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-sm font-semibold">Vouch</span>
        <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
