"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast"; // ✅ Replaces useToast()

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    newPassword: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");

    if (session?.user) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as any)?.phone || "",
        address: (session.user as any)?.address || "",
        newPassword: "",
      });
    }
  }, [session, status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("✅ Profile updated successfully!"); // ✅ replaced showToast()

      setTimeout(() => {
        router.push("/user/profile");
      }, 1200);
    } catch (err: any) {
      toast.error(`❌ ${err.message}`); // ✅ replaced showToast()
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return <p className="text-center text-yellow-400 mt-20">Loading profile...</p>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#3A0D0D] via-[#5C1A1A] to-[#8B2F2F] flex justify-center items-center text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#4B1E00]/60 backdrop-blur-md border border-[#FFD97A]/30 rounded-2xl p-8 w-full max-w-lg shadow-xl"
      >
        <h1 className="text-3xl font-serif text-[#FFD97A] mb-6 text-center">
          Edit Profile
        </h1>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#FFD97A]/90 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFF8E7]/10 border border-[#FFD97A]/40 rounded-lg text-[#FFF8E7] placeholder-[#FFF8E7]/60 focus:outline-none focus:border-[#FFD97A]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#FFD97A]/90 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFF8E7]/10 border border-[#FFD97A]/40 rounded-lg text-[#FFF8E7] placeholder-[#FFF8E7]/60 focus:outline-none focus:border-[#FFD97A]"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#FFD97A]/90 mb-1">
              Phone
            </label>
            <input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFF8E7]/10 border border-[#FFD97A]/40 rounded-lg text-[#FFF8E7] placeholder-[#FFF8E7]/60 focus:outline-none focus:border-[#FFD97A]"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#FFD97A]/90 mb-1">
              Address
            </label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFF8E7]/10 border border-[#FFD97A]/40 rounded-lg text-[#FFF8E7] placeholder-[#FFF8E7]/60 focus:outline-none focus:border-[#FFD97A]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#FFD97A]/90 mb-1">
              Change Password (optional)
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFF8E7]/10 border border-[#FFD97A]/40 rounded-lg text-[#FFF8E7] placeholder-[#FFF8E7]/60 focus:outline-none focus:border-[#FFD97A]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#FFD97A] text-[#4B1E00] px-6 py-2 rounded-lg font-semibold hover:bg-[#FFE28A] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/user/profile")}
              className="border border-[#FFD97A]/40 px-6 py-2 rounded-lg text-[#FFF8E7] hover:bg-[#FFD97A]/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
