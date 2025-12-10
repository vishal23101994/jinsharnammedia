"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      router.push(callbackUrl);
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
              Login to Jinsharnam
            </h1>
            <p className="text-sm text-slate-300">
              Welcome back! Continue your journey.
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-200">
                Password
              </label>
              <a
                href="/auth/forgot-password"
                className="text-[11px] text-emerald-300 hover:text-emerald-200"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold py-2.5 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/signup"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
