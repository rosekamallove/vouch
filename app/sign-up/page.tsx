"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"

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
      callbackUrl: "/dashboard",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Create an account</h2>
          <p className="text-base-content/60 text-sm mb-2">Start collecting testimonials in minutes</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="name"><span className="label-text">Name</span></label>
              <input id="name" name="name" type="text" autoFocus className="input input-bordered w-full" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="email"><span className="label-text">Email</span></label>
              <input id="email" name="email" type="email" required className="input input-bordered w-full" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password"><span className="label-text">Password</span></label>
              <input id="password" name="password" type="password" required minLength={8} className="input input-bordered w-full" />
            </div>
            {error && (
              <div className="alert alert-error py-2 text-sm">
                <span>{error}</span>
              </div>
            )}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
            </button>
          </form>
          <p className="mt-2 text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link href="/sign-in" className="link link-primary">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
