"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

type Event = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  eventDate: string;
  imageUrl?: string | null;
};

export default function EditEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔐 Auth guard
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // 📥 Fetch event
  useEffect(() => {
    fetch(`/api/admin/events/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load event");
        return r.json();
      })
      .then((e) =>
        setData({
          ...e,
          eventDate: e.eventDate.slice(0, 10), // yyyy-mm-dd
        })
      )
      .catch(() => alert("Failed to load event"));
  }, [id]);

  if (!data) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/events/${id}`, {
      method: "PUT", // ✅ IMPORTANT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        eventDate: new Date(data.eventDate).toISOString(),
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/events");
    } else {
      alert("Failed to save event");
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-[#4B1E00] mb-6">
        Edit Event
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
          className="w-full border rounded-lg p-3 h-32"
          placeholder="Description"
          value={data.description}
          onChange={(e) =>
            setData({ ...data, description: e.target.value })
          }
          required
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Location"
          value={data.location || ""}
          onChange={(e) =>
            setData({ ...data, location: e.target.value || null })
          }
        />

        <input
          type="date"
          className="w-full border rounded-lg p-3"
          value={data.eventDate}
          onChange={(e) =>
            setData({ ...data, eventDate: e.target.value })
          }
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
