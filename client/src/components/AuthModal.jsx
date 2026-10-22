import { useState } from "react"
import { authClient } from "../lib/auth-client"

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("signin")   // "signin" or "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const result =
      mode === "signup"
        ? await authClient.signUp.email({
            name: form.name,
            email: form.email,
            password: form.password,
          })
        : await authClient.signIn.email({
            email: form.email,
            password: form.password,
          })

    setLoading(false)

    if (result.error) {
      setError(result.error.message || "Something went wrong")
      return
    }
    onClose()   // success: the session hook in the header updates automatically
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signup" ? "Create account" : "Sign in"}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-surface p-6"
      >
        <h2 className="font-heading text-2xl text-ink">
          {mode === "signup" ? "Create account" : "Sign in"}
        </h2>

        {mode === "signup" && (
          <div className="mt-4">
            <label htmlFor="auth-name" className="block text-sm text-muted">Name</label>
            <input
              id="auth-name" name="name" required
              value={form.name} onChange={handleChange}
              className="mt-1 w-full rounded border border-white/10 bg-canvas p-2 text-ink"
            />
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="auth-email" className="block text-sm text-muted">Email</label>
          <input
            id="auth-email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            className="mt-1 w-full rounded border border-white/10 bg-canvas p-2 text-ink"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="auth-password" className="block text-sm text-muted">Password (min 8 characters)</label>
          <input
            id="auth-password" name="password" type="password" required minLength={8}
            value={form.password} onChange={handleChange}
            className="mt-1 w-full rounded border border-white/10 bg-canvas p-2 text-ink"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="mt-5 w-full rounded bg-accent py-2 font-medium text-canvas disabled:opacity-60"
        >
          {loading ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError("") }}
          className="mt-3 w-full text-sm text-muted hover:text-ink"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </form>
    </div>
  )
}