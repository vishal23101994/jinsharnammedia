"use client";

import { useRouter } from "next/navigation";

export default function NewPulakSagarLive() {
  const router = useRouter();

  const submit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch(
      "/api/admin/pulak-sagar-live",
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      router.push("/admin/pulak-sagar-live");
    } else {
      alert("Failed to create update");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="p-8 max-w-3xl mx-auto space-y-4"
    >
      <h1 className="text-2xl font-semibold">
        New Pulak Sagar Live Update
      </h1>

      <input
        name="title"
        placeholder="Title"
        required
        className="w-full border p-3 rounded"
      />

      <input
        name="location"
        placeholder="Current Location"
        required
        className="w-full border p-3 rounded"
      />

      <input
        name="state"
        placeholder="State"
        className="w-full border p-3 rounded"
      />

      <textarea
        name="message"
        placeholder="Live Update Message"
        required
        className="w-full border p-3 rounded min-h-[120px]"
      />

      <input
        name="mapLink"
        placeholder="Google Maps Link"
        className="w-full border p-3 rounded"
      />

      <input
        type="datetime-local"
        name="startDate"
        className="w-full border p-3 rounded"
      />

      <input
        type="datetime-local"
        name="endDate"
        className="w-full border p-3 rounded"
      />

      <input
        type="file"
        name="image"
        accept="image/*"
      />

      <button
        type="submit"
        className="px-6 py-3 bg-[#FFD97A] rounded font-semibold"
      >
        Publish Live Update
      </button>
    </form>
  );
}