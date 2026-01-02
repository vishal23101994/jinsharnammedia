"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUpdate() {
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("JINSHARNAM");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("category", category); // ✅ IMPORTANT

    await fetch("/api/admin/updates", {
      method: "POST",
      body: formData,
    });

    router.push("/admin/updates");
  };

  return (
    <form
      onSubmit={submit}
      className="p-8 max-w-3xl mx-auto space-y-4"
    >
      <h1 className="text-2xl font-semibold">Create Latest Update</h1>

      {/* TITLE */}
      <input
        name="title"
        placeholder="Title"
        required
        className="w-full border p-2 rounded"
      />

      {/* CONTENT */}
      <textarea
        name="content"
        placeholder="Content"
        required
        className="w-full border p-2 rounded min-h-[120px]"
      />

      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 rounded"
        required
      >
        <option value="JINSHARNAM">Jinsharnam Tirth</option>
        <option value="VATSALYA">Vatsalya Dhara Trust</option>
        <option value="ADVERTISEMENT">Advertisement</option>
      </select>

      {/* IMAGE UPLOAD */}
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const img = new Image();
          img.src = URL.createObjectURL(file);

          img.onload = () => {
            if (img.height < img.width) {
              alert("Upload portrait image");
              return;
            }
            setPreview(img.src);
          };
        }}
      />

      {/* IMAGE PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-h-[400px] rounded border"
        />
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        className="px-6 py-2 bg-[#FFD97A] rounded font-semibold"
      >
        Publish
      </button>
    </form>
  );
}
