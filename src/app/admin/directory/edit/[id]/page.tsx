"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch member details
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/directory/member/${id}`);
      const data = await res.json();
      setMember(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function saveChanges() {
    setSaving(true);

    const res = await fetch(`/api/directory/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });

    setSaving(false);

    if (res.ok) {
      alert("Member updated successfully!");
      router.push("/admin/directory/approved");
    } else {
      alert("Failed to update member.");
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-[#FFD97A] text-xl font-semibold">
        Loading member details...
      </div>
    );
  }

  return (
    <div className="p-10 text-[#FFF8E7] min-h-screen">
      <h1 className="text-3xl font-bold text-[#FFD97A] mb-8">
        ✏️ Edit Member — {member.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">

        {/* NAME */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.name || ""}
            onChange={(e) => setMember({ ...member, name: e.target.value })}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.email || ""}
            onChange={(e) => setMember({ ...member, email: e.target.value })}
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block mb-1">Phone</label>
          <input
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.phone || ""}
            onChange={(e) => setMember({ ...member, phone: e.target.value })}
          />
        </div>

        {/* POSITION */}
        <div>
          <label className="block mb-1">Position</label>
          <input
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.position || ""}
            onChange={(e) => setMember({ ...member, position: e.target.value })}
          />
        </div>

        {/* ORGANIZATION */}
        <div className="col-span-2">
          <label className="block mb-1">Organization</label>
          <input
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.organization || ""}
            onChange={(e) => setMember({ ...member, organization: e.target.value })}
          />
        </div>

        {/* ADDRESS */}
        <div className="col-span-2">
          <label className="block mb-1">Address</label>
          <textarea
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            rows={3}
            value={member.address || ""}
            onChange={(e) => setMember({ ...member, address: e.target.value })}
          />
        </div>

        {/* STATE */}
        <div>
          <label className="block mb-1">State</label>
          <input
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.state || ""}
            onChange={(e) => setMember({ ...member, state: e.target.value })}
          />
        </div>

        {/* BRANCH */}
        <div>
          <label className="block mb-1">Branch</label>
          <input
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.branch || ""}
            onChange={(e) => setMember({ ...member, branch: e.target.value })}
          />
        </div>

        {/* DATE OF BIRTH */}
        <div>
          <label className="block mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.dateOfBirth?.substring(0, 10) || ""}
            onChange={(e) => setMember({ ...member, dateOfBirth: e.target.value })}
          />
        </div>

        {/* DATE OF MARRIAGE */}
        <div>
          <label className="block mb-1">Date of Marriage</label>
          <input
            type="date"
            className="w-full p-3 rounded bg-[#3A0D0D]/40 border border-[#FFD97A]/30"
            value={member.dateOfMarriage?.substring(0, 10) || ""}
            onChange={(e) => setMember({ ...member, dateOfMarriage: e.target.value })}
          />
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-10">

        <button
          onClick={saveChanges}
          disabled={saving}
          className="bg-green-600 px-6 py-3 rounded text-white text-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={() => router.push(`/admin/directory/upload-photo/${id}`)}
          className="bg-yellow-500 px-6 py-3 rounded text-white text-lg"
        >
          Upload Photo
        </button>

        <button
          onClick={() => router.back()}
          className="bg-gray-600 px-6 py-3 rounded text-white text-lg"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
