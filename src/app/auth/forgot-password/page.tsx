"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setMessage(
          "If this email exists, a reset link has been sent to your inbox."
        );
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <Image
            src="/images/logo.jpg"
            alt="Jinsharnam Media"
            width={64}
            height={64}
            className="rounded-full bg-white border border-amber-400/60 shadow-md"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">
              Forgot your password?
            </h1>
            <p className="text-sm text-slate-300">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {message && (
            <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold py-2.5 transition disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send reset link"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400">
          Remembered your password?{" "}
          <a
            href="/auth/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}
