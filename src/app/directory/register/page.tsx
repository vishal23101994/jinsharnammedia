"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/* ================= OPTIONS ================= */

const positions = [
  "Upadhyaksh","Adhyaksh","Sanyojak","Mahamantri","Koshadhyaksh",
  "Sanyojika","Sanskratik Mantri","Mantri","Adhyaksha","Pravakta",
  "Karyadhyaksh","Sahayak Mantri","Karyadhyaksha",
  "Karyavyaksh","Karyadhyakshika","Other"
];

const zones = [
  "Zone - 1","Zone - 2","Zone - 3","Zone - 4",
  "Zone - 5","Zone - 6","Zone - 7","Zone - 8",
  "Zone - 9","Any other Zone"
];

const organizations = [
  "Akhil Bhartiya Pulak Jan Chetna Manch (Regd.)",
  "Rashtriya Jain Mahila Jagriti Manch (Regd.)",
  "Any Other"
];

export default function RegisterPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    organization: "",
    position: "",
    zone: "",
    state: "",
    branch: "",
    gender: "",
    dateOfBirth: "",
    dateOfMarriage: "",
  });

  const [otherPosition, setOtherPosition] = useState("");
  const [otherZone, setOtherZone] = useState("");
  const [otherOrganization, setOtherOrganization] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData();

    const finalPosition =
      form.position === "Other" ? otherPosition : form.position;

    const finalZone =
      form.zone === "Any other Zone" ? otherZone : form.zone;

    const finalOrganization =
      form.organization === "Any Other"
        ? otherOrganization
        : form.organization;

    Object.entries({
      ...form,
      position: finalPosition,
      zone: finalZone,
      organization: finalOrganization,
    }).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    if (file) fd.append("photo", file);

    try {
      const res = await fetch("/api/directory/register", {
        method: "POST",
        body: fd,
      });

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
        zone: "",
        state: "",
        branch: "",
        gender: "",
        dateOfBirth: "",
        dateOfMarriage: "",
      });

      setOtherPosition("");
      setOtherZone("");
      setOtherOrganization("");
      setFile(null);

    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Register as Directory Member
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* BASIC INFO */}
        <input required value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          placeholder="Full Name"
          className="w-full p-3 border rounded"
        />

        <input required value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          placeholder="Email"
          type="email"
          className="w-full p-3 border rounded"
        />

        <input value={form.phone}
          onChange={e => setForm({...form, phone: e.target.value})}
          placeholder="Phone"
          className="w-full p-3 border rounded"
        />

        <input value={form.address}
          onChange={e => setForm({...form, address: e.target.value})}
          placeholder="Address"
          className="w-full p-3 border rounded"
        />

        {/* ORGANIZATION */}
        <select
          value={form.organization}
          onChange={e => setForm({...form, organization: e.target.value})}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Organization</option>
          {organizations.map(org => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>

        {form.organization === "Any Other" && (
          <input
            value={otherOrganization}
            onChange={e => setOtherOrganization(e.target.value)}
            placeholder="Enter Organization"
            className="w-full p-3 border rounded"
            required
          />
        )}

        {/* POSITION */}
        <select
          value={form.position}
          onChange={e => setForm({...form, position: e.target.value})}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Position</option>
          {positions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>

        {form.position === "Other" && (
          <input
            value={otherPosition}
            onChange={e => setOtherPosition(e.target.value)}
            placeholder="Enter Position"
            className="w-full p-3 border rounded"
            required
          />
        )}

        {/* ZONE */}
        <select
          value={form.zone}
          onChange={e => setForm({...form, zone: e.target.value})}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Zone</option>
          {zones.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>

        {form.zone === "Any other Zone" && (
          <input
            value={otherZone}
            onChange={e => setOtherZone(e.target.value)}
            placeholder="Enter Zone"
            className="w-full p-3 border rounded"
            required
          />
        )}

        {/* LOCATION */}
        <div className="grid grid-cols-2 gap-3">
          <input value={form.state}
            onChange={e => setForm({...form, state: e.target.value})}
            placeholder="State"
            className="p-3 border rounded"
          />
          <input value={form.branch}
            onChange={e => setForm({...form, branch: e.target.value})}
            placeholder="Branch"
            className="p-3 border rounded"
          />
        </div>

        {/* GENDER */}
        <select
          value={form.gender}
          onChange={e=>setForm({...form, gender:e.target.value})}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Gents">Gents</option>
          <option value="Ladies">Ladies</option>
        </select>

        {/* DATES */}
        <input
          type="date"
          value={form.dateOfBirth}
          onChange={e => setForm({...form, dateOfBirth: e.target.value})}
          className="w-full p-3 border rounded"
        />

        <input
          type="date"
          value={form.dateOfMarriage}
          onChange={e => setForm({...form, dateOfMarriage: e.target.value})}
          className="w-full p-3 border rounded"
        />

        {/* PHOTO */}
        <div>
          <label className="block mb-1">Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <button
          disabled={submitting}
          className="px-6 py-3 bg-amber-500 rounded text-white font-semibold"
        >
          {submitting ? "Submitting..." : "Register"}
        </button>

      </form>
    </section>
  );
}