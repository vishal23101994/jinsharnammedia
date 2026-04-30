"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPulakSagarLive() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/pulak-sagar-live/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  const save = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const res = await fetch(
      `/api/admin/pulak-sagar-live/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      router.push("/admin/pulak-sagar-live");
    } else {
      alert("Failed to update");
    }
  };

  if (!data) return null;

  return (
    <form
      onSubmit={save}
      className="p-8 max-w-3xl mx-auto space-y-4"
    >
      <h1 className="text-2xl font-semibold">
        Edit Pulak Sagar Live Update
      </h1>

      <input
        value={data.title}
        onChange={(e) =>
          setData({ ...data, title: e.target.value })
        }
        className="w-full border p-3 rounded"
      />

      <input
        value={data.location}
        onChange={(e) =>
          setData({ ...data, location: e.target.value })
        }
        className="w-full border p-3 rounded"
      />

      <input
        value={data.state || ""}
        onChange={(e) =>
          setData({ ...data, state: e.target.value })
        }
        className="w-full border p-3 rounded"
      />

      <textarea
        value={data.message}
        onChange={(e) =>
          setData({ ...data, message: e.target.value })
        }
        className="w-full border p-3 rounded min-h-[120px]"
      />

      <input
        value={data.mapLink || ""}
        onChange={(e) =>
          setData({ ...data, mapLink: e.target.value })
        }
        className="w-full border p-3 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.isActive}
          onChange={(e) =>
            setData({
              ...data,
              isActive: e.target.checked,
            })
          }
        />
        Active
      </label>

      <button
        type="submit"
        className="px-6 py-3 bg-[#FFD97A] rounded font-semibold"
      >
        Save Changes
      </button>
    </form>
  );
}