"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(e.currentTarget)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      callbackUrl: "/onboarding",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <div className="w-full max-w-sm bg-background rounded-xl border border-border shadow-sm p-6 space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Create an account</h2>
          <p className="text-muted-foreground text-sm mt-1">Start collecting testimonials in minutes</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="name">Name</label>
            <Input id="name" name="name" type="text" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input id="password" name="password" type="password" required minLength={8} />
          </div>
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-foreground font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
