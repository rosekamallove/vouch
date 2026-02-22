import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold tracking-tight text-lg">Vouch</span>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <div className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs text-muted-foreground">
          Developer-first testimonial platform
        </div>
        <h1 className="text-5xl font-bold tracking-tight max-w-2xl leading-tight">
          Collect testimonials.<br />Serve them via API.
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Give your users a friendly form to share their experience. Get a REST API to display
          testimonials anywhere on your site — no widgets, no lock-in.
        </p>
        <div className="flex gap-3">
          <Button size="lg" asChild>
            <Link href="/sign-up">Start for free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how">See how it works</Link>
          </Button>
        </div>

        {/* Code snippet */}
        <div className="mt-8 w-full max-w-lg text-left bg-muted rounded-lg p-4 text-sm font-mono">
          <span className="text-muted-foreground"># Fetch your approved testimonials</span>
          <br />
          curl https://yourdomain.com/api/v1/testimonials/my-app \<br />
          {"  "}-H{" "}
          <span className="text-green-600 dark:text-green-400">
            &quot;Authorization: Bearer YOUR_API_KEY&quot;
          </span>
        </div>
      </main>

      {/* How it works */}
      <section id="how" className="border-t px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create a project",
                desc: "Sign up and create a project for your product. Get a unique collection link and API key.",
              },
              {
                step: "2",
                title: "Share the link",
                desc: "Send the collection URL to your users. They fill in a short form — name, message, photo, rating.",
              },
              {
                step: "3",
                title: "Approve & display",
                desc: "Review submissions in your dashboard. Approve the good ones, then display them via our REST API.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-2">
                <span className="text-3xl font-bold text-muted-foreground/40">{step}</span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-6 text-center text-xs text-muted-foreground">
        Vouch © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
