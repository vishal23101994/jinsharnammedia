"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PulakSagarLiveList() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/pulak-sagar-live")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">
        Pulak Sagar Live Updates
      </h1>

      <button
        onClick={() =>
          router.push("/admin/pulak-sagar-live/new")
        }
        className="mb-6 px-4 py-2 bg-[#FFD97A] rounded"
      >
        + New Live Update
      </button>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded shadow"
          >
            <h3 className="font-semibold">{item.title}</h3>

            <p className="text-sm text-gray-600">
              {item.location}, {item.state}
            </p>

            <div className="flex gap-4 mt-3">
              <button
                onClick={() =>
                  router.push(
                    `/admin/pulak-sagar-live/${item.id}`
                  )
                }
              >
                ✏️ Edit
              </button>

              <button
                onClick={async () => {
                  if (!confirm("Delete this update?"))
                    return;

                  await fetch(
                    `/api/admin/pulak-sagar-live/${item.id}`,
                    { method: "DELETE" }
                  );

                  location.reload();
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}