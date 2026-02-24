"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building2, Calendar, Crown } from "lucide-react";
import Script from "next/script";

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
  // ✅ Check if required fields are filled (including DOB & DOM)
  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.address.trim() !== "" &&
    form.organization.trim() !== "" &&
    form.position.trim() !== "" &&
    form.zone.trim() !== "" &&
    form.state.trim() !== "" &&
    form.branch.trim() !== "" &&
    form.gender.trim() !== "" &&
    form.dateOfBirth.trim() !== "";

  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1️⃣ Create Razorpay Order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
      });

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Pulak Manch Registration",
        description: "Registration Fee ₹1100",
        order_id: orderData.id,
        handler: async function (response: any) {

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
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).forEach(([k, v]) => v && fd.append(k, v as string));

          if (file) fd.append("photo", file);

          const verifyRes = await fetch("/api/payment/verify-and-register", {
            method: "POST",
            body: fd,
          });

          if (!verifyRes.ok) {
            toast.error("Payment verification failed");
            return;
          }

          toast.success("Registration Successful!");
          window.location.href = `/success?name=${form.name}&email=${form.email}&phone=${form.phone}`;
        },
        theme: { color: "#6A0000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF3C4] via-[#FFF8E7] to-[#FFE7B3] py-20 px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">

          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/pulakmanch.png"   // <-- put your logo path here
              alt="Jinsharnam Logo"
              width={120}
              height={120}
            />  
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-[#6A0000] mb-4">
            Pulak Manch Registration
          </h1>

          <div className="w-24 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto mb-4" />

          <p className="text-lg text-[#4B1E00] max-w-2xl mx-auto">
            Become a part of the Jinsharnam spiritual family and contribute
            towards discipline, character building and national consciousness.
          </p>
          {/* PRICE BADGE */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full
            bg-gradient-to-r from-[#6A0000] to-[#A00000] text-white shadow-2xl"
          >
            <Crown />
            <span className="text-xl font-semibold">
              Membership Fee ₹1100
            </span>
          </motion.div>

        </div>

        {/* GLASS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-2xl p-10"
        >

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* PERSONAL INFO */}
            <div>
              <h2 className="text-xl font-semibold text-[#6A0000] mb-4">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Input icon={<User size={18}/>} placeholder="Full Name"
                  value={form.name}
                  onChange={(v:string)=>setForm({...form,name:v})}
                />
                <Input icon={<Mail size={18}/>} placeholder="Email"
                  value={form.email}
                  onChange={(v:string)=>setForm({...form,email:v})}
                />
                <Input icon={<Phone size={18}/>} placeholder="Mobile"
                  value={form.phone}
                  onChange={(v:string)=>setForm({...form,phone:v})}
                />
                <Input icon={<MapPin size={18}/>} placeholder="Address"
                  value={form.address}
                  onChange={(v:string)=>setForm({...form,address:v})}
                />
              </div>
            </div>

            {/* ORGANIZATION DETAILS */}
            <div>
              <h2 className="text-xl font-semibold text-[#6A0000] mb-4">
                Organization Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <Select value={form.organization}
                  onChange={(v:string)=>setForm({...form,organization:v})}
                  options={organizations}
                  placeholder="Select Organization"
                />

                <Select value={form.position}
                  onChange={(v:string)=>setForm({...form,position:v})}
                  options={positions}
                  placeholder="Select Position"
                />

                <Select value={form.zone}
                  onChange={(v:string)=>setForm({...form,zone:v})}
                  options={zones}
                  placeholder="Select Zone"
                />

                <Input placeholder="State"
                  value={form.state}
                  onChange={(v:string)=>setForm({...form,state:v})}
                />

                <Input placeholder="Branch"
                  value={form.branch}
                  onChange={(v:string)=>setForm({...form,branch:v})}
                />

                <Select value={form.gender}
                  onChange={(v:string)=>setForm({...form,gender:v})}
                  options={["Gents","Ladies"]}
                  placeholder="Select Gender"
                />

                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-semibold text-[#6A0000] mb-1">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(v:string)=>setForm({...form,dateOfBirth:v})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6A0000] mb-1">
                      Date of Marriage
                    </label>
                    <Input
                      type="date"
                      value={form.dateOfMarriage}
                      onChange={(v:string)=>setForm({...form,dateOfMarriage:v})}
                    />
                  </div>

                </div>

              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#6A0000] mb-4">
                Profile Photo
              </h2>

              <label
                htmlFor="photoUpload"
                className="
                  flex flex-col items-center justify-center
                  border-2 border-dashed border-amber-400
                  rounded-2xl p-10
                  bg-white/60 backdrop-blur-md
                  hover:bg-amber-50
                  transition cursor-pointer
                  text-center
                "
              >
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />

                <div className="text-lg font-medium text-[#4B1E00]">
                  {file ? file.name : "Click to choose file"}
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Upload a clear passport-size photo (JPG / PNG)
                </p>
              </label>
            </div>

            <div className="text-center pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                disabled={submitting || !isFormValid}
                className={`
                  relative group px-14 py-4 rounded-full
                  text-lg font-semibold text-white
                  transition-all duration-300 overflow-hidden
                  ${
                    submitting || !isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#6A0000] via-[#8B0000] to-[#A00000] shadow-xl hover:shadow-2xl"
                  }
                `}
              >
                {/* Glow */}
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-300/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />

                {/* Shine */}
                <span className="absolute left-[-100%] top-0 h-full w-1/2 bg-white/20 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" />

                <span className="relative">
                  {submitting ? "Submitting..." : "Complete Registration"}
                </span>
              </motion.button>
            </div>

          </form>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= REUSABLE INPUT ================= */

function Input({ icon, placeholder, value, onChange, type="text" }: any) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A0000]">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-300 bg-white/80 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition"
      />
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: any) {
  return (
    <select
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-white/80 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition"
    >
      <option value="">{placeholder}</option>
      {options.map((o:any)=>(
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}