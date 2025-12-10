"use client";

import { useState } from "react";

export default function UploadExcelPage() {
  const [uploading, setUploading] = useState(false);

  const upload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    await fetch("/api/directory/upload-excel", {
      method: "POST",
      body: form,
    });

    alert("Excel Uploaded Successfully!");
    setUploading(false);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">📤 Upload Directory Excel</h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={upload}
        className="text-black bg-white px-4 py-2 rounded"
      />

      {uploading && (
        <p className="mt-4 text-yellow-300">Uploading...</p>
      )}
    </div>
  );
}
