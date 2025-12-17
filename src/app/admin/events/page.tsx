"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  eventDate: string;
  published: boolean;
};

export default function AdminEvents() {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (session?.user.role !== "ADMIN") router.push("/");
    fetch("/api/admin/events").then(r => r.json()).then(setEvents);
  }, [session]);

  return (
    <main className="p-8 text-[#4B1E00]">
      <h1 className="text-3xl font-serif mb-6">📅 Upcoming Events</h1>

      <button
        onClick={() => router.push("/admin/events/new")}
        className="mb-6 px-5 py-2 rounded-full bg-[#7AD7FF] font-semibold"
      >
        + New Event
      </button>

      <div className="space-y-4">
        {events.map(e => (
          <div key={e.id} className="p-4 bg-white rounded-xl shadow border">
            <h3 className="font-semibold">{e.title}</h3>
            <p className="text-sm">
              📆 {new Date(e.eventDate).toDateString()}
            </p>
            <span>{e.published ? "✅ Published" : "⏸ Draft"}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
