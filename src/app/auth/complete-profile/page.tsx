"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone || undefined,
          address: address || undefined,
          password: password || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update profile");
      } else {
        setMessage("Profile updated successfully");
        setTimeout(() => router.push("/"), 1200);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">
            Complete your profile
          </h1>
          <p className="text-sm text-slate-300">
            Add your contact details and delivery address. You can also create a
            password to login with email in future.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Phone number
              </label>
              <input
                type="tel"
                className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98xxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Delivery address
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no, street, city, state, pincode"
              rows={3}
            />
          </div>

          <div className="border border-slate-700/80 rounded-2xl p-4 space-y-3 bg-slate-900/40">
            <p className="text-xs font-medium text-slate-200">
              Optional: Create a password
            </p>
            <p className="text-xs text-slate-400">
              If you set a password, you&apos;ll be able to login with email +
              password in addition to Google.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty to skip"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
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
            {loading ? "Saving..." : "Save & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
