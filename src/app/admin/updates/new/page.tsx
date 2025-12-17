"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUpdate() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/admin/updates", {
      method: "POST",
      body: new FormData(e.target),
    });
    router.push("/admin/updates");
  };

  return (
    <form onSubmit={submit} className="p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl">Create Latest Update</h1>

      <input name="title" placeholder="Title" required className="w-full border p-2" />
      <textarea name="content" placeholder="Content" required className="w-full border p-2" />

      <input type="file" name="image" accept="image/*"
        onChange={e => {
          const f = e.target.files?.[0];
          if (!f) return;
          const img = new Image();
          img.src = URL.createObjectURL(f);
          img.onload = () => {
            if (img.height < img.width) return alert("Upload portrait image");
            setPreview(img.src);
          };
        }}
      />

      {preview && <img src={preview} className="max-h-[400px] rounded" />}

      <button className="px-4 py-2 bg-[#FFD97A] rounded">Publish</button>
    </form>
  );
}
