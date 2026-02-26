import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Nav */}
      <header className="border-b border-base-300 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="font-bold tracking-tight text-lg">✦ Vouch</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/sign-in" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/sign-up" className="btn btn-primary btn-sm">Get started free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-28 gap-8 max-w-4xl mx-auto w-full animate-fade-in">
        <div className="badge badge-outline badge-lg gap-2 py-3 px-4">
          ✦ Built for developers and indie hackers
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tighter leading-[1.05] max-w-3xl">
          Stop copy-pasting
          <br />
          <span className="text-primary">testimonials.</span>
        </h1>

        <p className="text-base-content/70 text-xl max-w-lg leading-relaxed">
          Give users a beautiful form to share their story. You get a clean REST API to display social proof anywhere — in minutes, not days.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/sign-up" className="btn btn-primary btn-lg text-base px-8">
            Start collecting — it&apos;s free
          </Link>
          <Link href="#how" className="btn btn-outline btn-lg text-base px-8">
            See how it works
          </Link>
        </div>

        {/* Code block */}
        <div className="mt-4 w-full max-w-xl text-left bg-neutral rounded-2xl p-5 text-sm font-mono shadow-xl">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="text-neutral-content/50 text-xs mb-1"># one curl call to rule them all</div>
          <div className="text-neutral-content/90 leading-7">
            curl https://vouch.app/api/v1/testimonials/<span className="text-primary">my-saas</span> \
            <br />
            {"  "}-H <span className="text-success">&quot;Authorization: Bearer sk_••••••••&quot;</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-base-300 px-6 py-24">
        <div className="max-w-4xl mx-auto space-y-14">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dead simple by design</h2>
            <p className="text-base-content/60">Three steps. No fluff.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🏗️", step: "01", title: "Create a project", desc: "Sign up, name your project, and get a shareable collection link + a secret API key. Takes under two minutes." },
              { emoji: "📬", step: "02", title: "Let the love roll in", desc: "Drop the link in your onboarding email or Slack. Users fill a friendly form — name, photo, rating, their story." },
              { emoji: "⚡", step: "03", title: "Approve & ship", desc: "Review submissions in your dashboard, approve the good ones, and hit the API from your website. Done." },
            ].map(({ emoji, step, title, desc }) => (
              <div key={step} className="card bg-base-200 hover:shadow-md transition-all border border-base-300 hover:border-primary/40">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-xs font-mono text-base-content/30 font-bold">{step}</span>
                  </div>
                  <h3 className="card-title text-base">{title}</h3>
                  <p className="text-sm text-base-content/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-base-300 px-6 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Your users love your product.
            <br />
            <span className="text-primary">Let them prove it.</span>
          </h2>
          <p className="text-base-content/60 text-lg">
            Free to start. No credit card. No widgets. Just an API.
          </p>
          <Link href="/sign-up" className="btn btn-primary btn-lg text-base px-10">
            Get started — it&apos;s free ✦
          </Link>
        </div>
      </section>

      <footer className="border-t border-base-300 px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-sm font-semibold">✦ Vouch</span>
        <span className="text-xs text-base-content/50">© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
