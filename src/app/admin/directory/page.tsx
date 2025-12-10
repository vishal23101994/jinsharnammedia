"use client";

import { useRouter } from "next/navigation";

export default function AdminDirectoryHome() {
  const router = useRouter();

  return (
    <div className="p-10 text-[#FFF8E7] min-h-screen">
      <h1 className="text-4xl font-bold text-[#FFD97A] mb-8">
        📇 Directory Management
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <button
          onClick={() => router.push("/admin/directory/pending")}
          className="p-6 bg-[#4B1E00]/50 border border-[#FFD97A]/30 rounded-xl text-left hover:bg-[#5C2A10] transition"
        >
          <h2 className="text-xl font-bold text-[#FFD97A]">Pending Members</h2>
          <p>Approve or reject member registrations.</p>
        </button>

        <button
          onClick={() => router.push("/admin/directory/approved")}
          className="p-6 bg-[#4B1E00]/50 border border-[#FFD97A]/30 rounded-xl text-left hover:bg-[#5C2A10] transition"
        >
          <h2 className="text-xl font-bold text-[#FFD97A]">Approved Members</h2>
          <p>Edit or manage existing directory records.</p>
        </button>

        <button
          onClick={() => router.push("/admin/directory/upload-excel")}
          className="p-6 bg-[#4B1E00]/50 border border-[#FFD97A]/30 rounded-xl text-left hover:bg-[#5C2A10] transition"
        >
          <h2 className="text-xl font-bold text-[#FFD97A]">Upload Excel</h2>
          <p>Bulk import directory using Excel file.</p>
        </button>
      </div>
    </div>
  );
}
