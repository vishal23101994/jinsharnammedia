"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PendingMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);

  async function loadData() {
    const res = await fetch("/api/directory/pending");
    const data = await res.json();
    setMembers(data);
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
      <h1 className="text-3xl font-bold text-[#FFD97A] mb-6">Pending Members</h1>

      {members.map((m: any) => (
        <div key={m.id} className="bg-[#4B1E00]/40 p-6 mb-4 rounded-xl">
          
          <h3 className="text-xl font-bold">{m.name}</h3>
          {m.email && <p>Email: {m.email}</p>}
          {m.phone && <p>Phone: {m.phone}</p>}

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => approve(m.id)}
              className="bg-green-600 px-4 py-2 rounded text-white"
            >
              Approve
            </button>

            <button
              onClick={() => reject(m.id)}
              className="bg-red-600 px-4 py-2 rounded text-white"
            >
              Reject
            </button>

            <button
              onClick={() => router.push(`/admin/directory/edit/${m.id}`)}
              className="bg-blue-500 px-4 py-2 rounded text-white"
            >
              Edit
            </button>
          </div>

        </div>
      ))}

      {members.length === 0 && (
        <p className="text-lg text-center opacity-70">No pending members</p>
      )}
    </div>
  );
}
