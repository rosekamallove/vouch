"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(e.currentTarget)

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Sign in</h2>
          <p className="text-base-content/60 text-sm mb-2">Enter your email and password to continue</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email"><span className="label-text">Email</span></label>
              <input id="email" name="email" type="email" required autoFocus className="input input-bordered w-full" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password"><span className="label-text">Password</span></label>
              <input id="password" name="password" type="password" required className="input input-bordered w-full" />
            </div>
            {error && (
              <div className="alert alert-error py-2 text-sm">
                <span>{error}</span>
              </div>
            )}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign in"}
            </button>
          </form>
          <p className="mt-2 text-center text-sm text-base-content/60">
            No account?{" "}
            <Link href="/sign-up" className="link link-primary">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
