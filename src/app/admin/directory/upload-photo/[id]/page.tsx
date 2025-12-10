"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function UploadPhotoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [file, setFile] = useState<File | null>(null);

  async function upload() {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const form = new FormData();
    form.append("photo", file);

    const res = await fetch(`/api/directory/upload-photo/${id}`, {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      alert("Photo uploaded successfully!");
      router.push("/admin/directory/approved");
    } else {
      alert("Failed to upload photo");
    }
  }

  return (
    <div className="p-10 text-[#FFF8E7] min-h-screen">
      <h1 className="text-3xl font-bold text-[#FFD97A] mb-6">
        📸 Upload Photo
      </h1>

      <div className="bg-[#4B1E00]/40 border border-[#FFD97A]/30 p-6 rounded-xl max-w-md">

        <input
          type="file"
          accept="image/*"
          className="block w-full mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={upload}
          className="bg-yellow-500 px-6 py-3 rounded text-white text-lg"
        >
          Upload
        </button>

      </div>
    </div>
  );
}
