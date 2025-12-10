"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    organization: "",
    position: "",
    state: "",
    branch: "",
    gender: "",
    dateOfBirth: "",
    dateOfMarriage: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v as string));
    if (file) fd.append("photo", file);

    try {
      const res = await fetch("/api/directory/register", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      toast.success("Registered — pending admin approval");
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        organization: "",
        position: "",
        state: "",
        branch: "",
        gender: "",
        dateOfBirth: "",
        dateOfMarriage: "",
      });
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register as Directory Member</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" className="w-full p-2 border rounded"/>
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 border rounded"/>
        <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" className="w-full p-2 border rounded"/>
        <input value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} placeholder="Organization" className="w-full p-2 border rounded"/>
        <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} placeholder="Position" className="w-full p-2 border rounded"/>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.state} onChange={e => setForm({...form, state: e.target.value})} placeholder="State" className="p-2 border rounded"/>
          <input value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} placeholder="Branch" className="p-2 border rounded"/>
        </div>
        <select value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})} className="w-full p-2 border rounded">
          <option value="">Select Gender</option><option value="Gents">Gents</option><option value="Ladies">Ladies</option>
        </select>
        <input value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} placeholder="Date of Birth (dd.mm.yyyy)" className="w-full p-2 border rounded"/>
        <input value={form.dateOfMarriage} onChange={e => setForm({...form, dateOfMarriage: e.target.value})} placeholder="Date of Marriage (dd.mm.yyyy)" className="w-full p-2 border rounded"/>
        <div>
          <label className="block mb-1">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <button disabled={submitting} className="px-4 py-2 bg-amber-400 rounded">{submitting ? "Submitting..." : "Register"}</button>
      </form>
    </section>
  );
}
