"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdatesList() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/updates").then(r => r.json()).then(setItems);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Latest Updates</h1>
      <button onClick={() => router.push("/admin/updates/new")}
        className="mb-6 px-4 py-2 bg-[#FFD97A] rounded">
        + New Update
      </button>

      <div className="grid gap-4">
        {items.map(u => (
          <div key={u.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{u.title}</h3>
            <div className="flex gap-4 mt-3">
              <button onClick={() => router.push(`/admin/updates/${u.id}`)}>✏️ Edit</button>
              <button onClick={async () => {
                if (!confirm("Delete?")) return;
                await fetch(`/api/admin/updates/${u.id}`, { method: "DELETE" });
                location.reload();
              }}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
