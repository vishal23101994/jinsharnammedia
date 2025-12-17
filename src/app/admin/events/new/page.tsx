"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/events", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/events");
    } else {
      alert("Failed to create event");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Event title" required className="w-full border p-2" />
        <textarea name="description" placeholder="Description" className="w-full border p-2" />
        <input name="location" placeholder="Location" className="w-full border p-2" />
        <input name="eventDate" type="date" required className="w-full border p-2" />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full border p-2"
        />

        <button
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-black rounded"
        >
          {loading ? "Saving..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
