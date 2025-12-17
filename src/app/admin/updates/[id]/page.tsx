"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

type Update = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
};

export default function EditUpdatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<Update | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔐 Auth guard
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // 📥 Fetch update
  useEffect(() => {
    fetch(`/api/admin/updates/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load update");
        return r.json();
      })
      .then(setData)
      .catch(() => alert("Failed to load update"));
  }, [id]);

  if (!data) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/updates/${id}`, {
      method: "PUT", // ✅ IMPORTANT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/updates");
    } else {
      alert("Failed to save update");
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-[#4B1E00] mb-6">
        Edit Latest Update
      </h1>

      <form onSubmit={handleSave} className="space-y-5">
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          required
        />

        <textarea
          className="w-full border rounded-lg p-3 h-40"
          placeholder="Content"
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          required
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Image URL (optional)"
          value={data.imageUrl || ""}
          onChange={(e) =>
            setData({ ...data, imageUrl: e.target.value || null })
          }
        />

        <button
          disabled={loading}
          className="px-6 py-3 bg-[#FFD97A] rounded-lg font-semibold text-[#4B1E00]"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
