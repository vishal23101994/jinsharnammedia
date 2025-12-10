"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
};

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/${session.user.email}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setPhoneInput(data.phone || "");
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [session]);

  const handleSavePhone = async () => {
    if (!phoneInput) {
      alert("Please enter a phone number.");
      return;
    }

    try {
      const res = await fetch(`/api/user/update-phone`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, phone: phoneInput }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Phone updated. You can now verify it.");
        setUser((u) => (u ? { ...u, phone: phoneInput, phoneVerified: false } : u));
      } else {
        alert(data.error || "Failed to update phone.");
      }
    } catch (error) {
      console.error("Update phone error:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#3A0D0D] via-[#5C1A1A] to-[#8B2F2F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#FFE8B0]/80">
          <div className="h-10 w-10 border-2 border-[#FFD97A]/40 border-t-[#FFD97A] rounded-full animate-spin" />
          <p className="text-sm">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#3A0D0D] via-[#5C1A1A] to-[#8B2F2F] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#4B1E00]/60 border border-[#FFD97A]/30 rounded-2xl p-8 text-center shadow-lg text-[#FFF8E7]">
          <h1 className="text-2xl font-serif text-[#FFD97A] mb-3">You&apos;re not logged in</h1>
          <p className="text-sm text-[#FFE8B0]/85 mb-6">
            Please log in to view and manage your profile information.
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] font-semibold text-sm shadow-md hover:shadow-lg transition"
          >
            Go to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3A0D0D] via-[#5C1A1A] to-[#8B2F2F] text-[#FFF8E7] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header card */}
        <section className="bg-[#4B1E00]/60 backdrop-blur-md border border-[#FFD97A]/30 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[#FFD97A]/15 border border-[#FFD97A]/40 flex items-center justify-center text-2xl font-semibold text-[#FFD97A]">
                {user?.name?.[0]?.toUpperCase() || session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-[#FFD97A]">
                  My Profile
                </h1>
                <p className="text-xs sm:text-sm text-[#FFE8B0]/80 mt-1">
                  Manage your account details and keep your contact information up to date.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/10 text-[11px] uppercase tracking-wide text-[#FFE8B0]/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Logged in
              </span>
              <span className="inline-flex items-center gap-2 text-[11px] text-[#FFE8B0]/70">
                <span className="h-[1px] w-8 bg-[#FFE8B0]/40" />
                Member account
              </span>
            </div>
          </div>
        </section>

        {/* Details + Phone */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Basic info */}
          <div className="bg-[#4B1E00]/60 backdrop-blur-md border border-[#FFD97A]/30 rounded-2xl p-6 sm:p-7 shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold text-[#FFD97A] mb-4">
              Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#FFD97A]/70 mb-1">Name</label>
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full p-3 rounded-lg bg-[#FFF8E7]/10 border border-[#FFD97A]/30 text-sm text-[#FFF8E7]/90 focus:outline-none cursor-default"
                />
              </div>

              <div>
                <label className="block text-xs text-[#FFD97A]/70 mb-1">Email</label>
                <input
                  type="text"
                  value={user?.email || ""}
                  readOnly
                  className="w-full p-3 rounded-lg bg-[#FFF8E7]/10 border border-[#FFD97A]/30 text-sm text-[#FFF8E7]/90 focus:outline-none cursor-default"
                />
                <p className="mt-1 text-[11px] text-[#FFE8B0]/70">
                  This is your primary login email and cannot be changed from here.
                </p>
              </div>
            </div>
          </div>

          {/* Phone + verification */}
          <div className="space-y-4">
            <div className="bg-[#4B1E00]/60 backdrop-blur-md border border-[#FFD97A]/30 rounded-2xl p-6 sm:p-7 shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold text-[#FFD97A] mb-4">
                Phone &amp; Verification
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#FFD97A]/70 mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91XXXXXXXXXX"
                      className="flex-1 p-3 rounded-lg bg-[#FFF8E7]/10 border border-[#FFD97A]/30 text-sm text-[#FFF8E7]/90 focus:border-[#FFD97A] focus:outline-none placeholder:text-[#FFE8B0]/50"
                    />
                    <button
                      onClick={handleSavePhone}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] font-semibold text-xs sm:text-sm hover:shadow-md transition"
                    >
                      Save
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-[#FFE8B0]/70">
                    We&apos;ll use this number only for important account notifications and OTPs.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#FFF8E7]/80 mb-1">Verification</span>
                    {user?.phoneVerified ? (
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40">
                          Verified
                          <span className="ml-1">✅</span>
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-rose-300">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-rose-500/15 border border-rose-400/40">
                          Not verified
                          <span className="ml-1">❌</span>
                        </span>
                      </span>
                    )}
                  </div>

                  {!user?.phoneVerified && user?.phone && (
                    <button
                      onClick={() => setShowOtp(true)}
                      className="px-4 py-2 bg-[#FFD97A] text-[#4B1E00] rounded-lg font-medium text-xs sm:text-sm hover:bg-[#FFE28A] transition shadow-sm"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Small hint panel */}
            <div className="bg-black/25 border border-[#FFD97A]/25 rounded-2xl p-4 text-xs text-[#FFE8B0]/80 shadow-sm">
              <div className="flex gap-3">
                <span className="text-lg">🔐</span>
                <div>
                  <p className="font-semibold text-[#FFD97A] mb-1">
                    Keep your account secure
                  </p>
                  <p>
                    Make sure your phone number is correct and verified so we can help
                    you recover your account if you ever lose access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showOtp && (
        <PhoneVerificationModal
          phone={user?.phone || ""}
          onClose={() => setShowOtp(false)}
          onVerified={() => setUser((u) => (u ? { ...u, phoneVerified: true } : u))}
        />
      )}
    </main>
  );
}
