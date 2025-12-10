"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Failed to sign up");
      } else {
        setMessage("Account created. Logging you in...");
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/auth/complete-profile",
        });
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    await signIn("google", { callbackUrl: "/auth/complete-profile" });
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
              Create your Jinsharnam account
            </h1>
            <p className="text-sm text-slate-300">
              Join the community and stay connected.
            </p>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 border border-slate-500/60 hover:border-slate-200 rounded-xl py-2.5 text-sm font-medium text-white bg-slate-900/40 hover:bg-slate-800 transition"
        >
          {/* Google icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3A11.9 11.9 0 0 1 24 36a12 12 0 0 1 0-24c3.1 0 5.9 1.2 8 3.1l5.7-5.7A19.9 19.9 0 0 0 24 4 20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7 12.8 19a11.9 11.9 0 0 1 11.2-7 11.9 11.9 0 0 1 8 3.1l5.7-5.7A19.9 19.9 0 0 0 24 4 19.9 19.9 0 0 0 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44a19.9 19.9 0 0 0 13.7-5.3L32 33a11.8 11.8 0 0 1-8 3 11.9 11.9 0 0 1-11.3-8.2l-6.4 4.9A19.9 19.9 0 0 0 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.2 5.7L37.7 38A19.5 19.5 0 0 0 44 24c0-1.2-.1-2.3-.4-3.5z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex-1 h-px bg-slate-600" />
          <span>or create with email</span>
          <span className="flex-1 h-px bg-slate-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

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

          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
