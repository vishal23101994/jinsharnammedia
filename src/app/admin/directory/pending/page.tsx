"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PendingMembersPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const res = await fetch("/api/directory/pending", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data);
        return;
      }

      setRequests(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function approve(id: number) {
    await fetch(`/api/directory/approve/${id}`, { method: "POST" });
    loadData();
  }

  async function reject(id: number) {
    await fetch(`/api/directory/reject/${id}`, { method: "POST" });
    loadData();
  }

  return (
    <div className="p-10 text-[#FFF8E7] min-h-screen">
      <h1 className="text-3xl font-bold text-[#FFD97A] mb-6">
        Pending Registration Requests
      </h1>

      {loading && (
        <p className="opacity-70 text-lg">Loading...</p>
      )}

      {!loading && requests.length === 0 && (
        <p className="text-lg text-center opacity-70">
          No pending requests
        </p>
      )}

      {!loading &&
        requests.map((r) => (
          <div
            key={r.id}
            className="bg-[#4B1E00]/40 p-6 mb-4 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-[#FFD97A]">
              {r.name}
            </h3>

            {r.email && <p>Email: {r.email}</p>}
            {r.phone && <p>Phone: {r.phone}</p>}
            {r.organization && <p>Organization: {r.organization}</p>}
            {r.position && <p>Position: {r.position}</p>}

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => approve(r.id)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition"
              >
                Approve
              </button>

              <button
                onClick={() => reject(r.id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}