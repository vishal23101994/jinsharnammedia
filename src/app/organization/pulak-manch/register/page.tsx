"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building2, Calendar, Crown } from "lucide-react";
import Script from "next/script";
import Cropper from "react-easy-crop";

/* ================= OPTIONS ================= */

const positions = [
  "Adhyaksh","Adhyaksha","Karyadhyaksha","Karyadhyakshika","Karyavyaksh",
  "Koshadhyaksh","Mahamantri","Mantri","Mukhya Salahkar","Mukhya Sanyojak",
  "Param Sanrakshak","Pravakta","Rashtriya Koshadhyaksh",
  "Sadasya","Sadasyika","Sahayak Mantri","Sangathan Mantri","Sanskratik Mantri",
  "Sanyojak","Sanyojika","Shiksha Mantri","Upadhyaksh","Varishth Upadhyaksh","Other"
];

const zones = [
  "Zone - 1","Zone - 2","Zone - 3","Zone - 4",
  "Zone - 5","Zone - 6","Zone - 7","Zone - 8",
  "Zone - 9","Any other Zone"
];

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
  "Other"
];

const organizations = [
  "Akhil Bhartiya Pulak Jan Chetna Manch (Regd.)",
  "Rashtriya Jain Mahila Jagriti Manch (Regd.)",
  "Rashtriya Karyakarini (Regd.)",
  "Any Other"
];

export default function RegisterPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhones: [] as string[],
    pincode: "",
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

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [otherState, setOtherState] = useState("");
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

  
  async function handleOnlinePayment(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {

      // ✅ 1. Check if email already exists
      const checkRes = await fetch("/api/directory/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      if (!checkRes.ok) {
        const errorData = await checkRes.json();
        toast.error(errorData.message || "Registration not allowed");
        setSubmitting(false);
        return;
      }
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

          const finalState = form.state === "Other" ? otherState : form.state;

          const finalAddress = form.pincode
            ? `${form.address}, Pincode: ${form.pincode}`
            : form.address;

          const finalPhone = form.alternatePhones.length > 0
            ? `${form.phone} | Alt: ${form.alternatePhones.join(", ")}`
            : form.phone;

          Object.entries({
            ...form,
            phone: finalPhone,
            address: finalAddress,
            state: finalState,
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
            const errorData = await verifyRes.json();
            toast.error(errorData.message || "Registration failed");
            return;
          }

          toast.success("Payment received. Awaiting admin approval ✅");
          window.location.href = "/pending";
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

  async function handleOfflineSubmit() {
    setSubmitting(true);

    try {
      const fd = new FormData();

      const finalPosition =
        form.position === "Other" ? otherPosition : form.position;

      const finalZone =
        form.zone === "Any other Zone" ? otherZone : form.zone;

      const finalOrganization =
        form.organization === "Any Other"
          ? otherOrganization
          : form.organization;

      const finalState = form.state === "Other" ? otherState : form.state;

      const finalAddress = form.pincode
        ? `${form.address}, Pincode: ${form.pincode}`
        : form.address;

      const finalPhone = form.alternatePhones.length > 0
        ? `${form.phone} | Alt: ${form.alternatePhones.join(", ")}`
        : form.phone;

      Object.entries({
        ...form,
        phone: finalPhone,
        address: finalAddress,
        state: finalState,
        position: finalPosition,
        zone: finalZone,
        organization: finalOrganization,
      }).forEach(([k, v]) => v && fd.append(k, v as string));

      if (file) fd.append("photo", file);

      const res = await fetch("/api/directory/register", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Registration failed");
        setSubmitting(false);
        return;
      }

      toast.success("Submitted for Admin Approval ✅");
      window.location.href = "/pending";

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function detectStateFromPincode(pin: string) {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) return;

    try {
      toast.loading("Detecting state...", { id: "stateDetect" });

      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const stateName = data[0].PostOffice[0].State;
        setForm(prev => ({ ...prev, state: stateName }));
        toast.success("State auto detected ✔", { id: "stateDetect" });
      } else {
        toast.error("Invalid pincode", { id: "stateDetect" });
      }
    } catch {
      toast.error("Could not detect state", { id: "stateDetect" });
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

          <form className="space-y-8">

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
                  onChange={(v:string)=>setForm({...form,email:v.toLowerCase()})}
                />
                <Input icon={<Phone size={18}/>} placeholder="Mobile"
                  value={form.phone}
                  onChange={(v:string)=>setForm({...form,phone:v})}
                />
                {/* Alternate Phone Add Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (form.alternatePhones.length >= 3) {
                      toast.error("Maximum 3 alternate numbers allowed");
                      return;
                    }

                    setForm({
                      ...form,
                      alternatePhones: [...form.alternatePhones, ""],
                    });
                  }}
                  className="text-sm text-blue-700 underline"
                >
                  + Add Alternate Phone
                </button>

                {/* Alternate Phone Inputs */}
                {form.alternatePhones.map((phone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 items-center"
                  >
                    <Input
                      placeholder={`Alternate Phone ${index + 1}`}
                      value={phone}
                      onChange={(v:string)=>{
                        const updated = [...form.alternatePhones];
                        updated[index] = v;
                        const unique = [...new Set(updated.filter(p => p.trim() !== ""))];
                        setForm({...form, alternatePhones: unique});
                      }}
                    />
                    <button
                      type="button"
                      onClick={()=>{
                        const updated = form.alternatePhones.filter((_,i)=>i!==index);
                        setForm({...form, alternatePhones: updated});
                      }}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </motion.div>
                ))}
                <Input icon={<MapPin size={18}/>} placeholder="Address"
                  value={form.address}
                  onChange={(v:string)=>setForm({...form,address:v})}
                />
                <Input
                  icon={<MapPin size={18}/>}
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(v:string)=>{
                    setForm({...form,pincode:v});
                    detectStateFromPincode(v);
                  }}
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
                {form.organization === "Any Other" && (
                  <Input
                    placeholder="Enter Organization"
                    value={otherOrganization}
                    onChange={(v:string)=>setOtherOrganization(v)}
                  />
                )}

                <Select value={form.position}
                  onChange={(v:string)=>setForm({...form,position:v})}
                  options={positions}
                  placeholder="Select Position"
                />
                {form.position === "Other" && (
                  <Input
                    placeholder="Enter Position"
                    value={otherPosition}
                    onChange={(v:string)=>setOtherPosition(v)}
                  />
                )}

                <Select value={form.zone}
                  onChange={(v:string)=>setForm({...form,zone:v})}
                  options={zones}
                  placeholder="Select Zone"
                />
                {form.zone === "Any other Zone" && (
                  <Input
                    placeholder="Enter Zone"
                    value={otherZone}
                    onChange={(v:string)=>setOtherZone(v)}
                  />
                )}

                <Select
                  value={form.state}
                  onChange={(v:string)=>setForm({...form,state:v})}
                  options={indianStates}
                  placeholder="Select State"
                />

                {form.state === "Other" && (
                  <Input
                    placeholder="Enter State"
                    value={otherState}
                    onChange={(v:string)=>setOtherState(v)}
                  />
                )}

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
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => setImageSrc(reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />

                <div className="text-lg font-medium text-[#4B1E00]">
                  <div className="flex flex-col items-center">
                    {file ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Profile"
                        width={120}
                        height={120}
                        className="rounded-full object-cover border-4 border-amber-400"
                      />
                    ) : (
                      <div className="text-lg font-medium text-[#4B1E00]">
                        Click to choose file
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Upload a clear passport-size photo (JPG / PNG)
                </p>
              </label>
              {imageSrc && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-2xl w-[460px] p-8"
                  >
                    {/* Crop Container */}
                    <div className="relative w-full max-w-[360px] h-[420px] mx-auto bg-gradient-to-br from-gray-800 to-black rounded-xl overflow-hidden shadow-inner">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={3 / 4}
                        cropShape="rect"
                        showGrid={true}
                        objectFit="contain"
                        restrictPosition={false}
                        minZoom={1}
                        maxZoom={3}
                        zoomSpeed={0.1}
                        style={{
                          cropAreaStyle: {
                            border: "2px solid #ffffff",
                            borderRadius: "8px",
                          },
                        }}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, croppedAreaPixels) =>
                          setCroppedAreaPixels(croppedAreaPixels)
                        }
                      />
                    </div>

                    {/* Save */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!croppedAreaPixels) return;

                        const canvas = document.createElement("canvas");
                        const img = new window.Image();
                        img.src = imageSrc!;

                        await new Promise((resolve) => {
                          img.onload = resolve;
                        });

                        const outputWidth = 360;
                        const outputHeight = 460;

                        canvas.width = outputWidth;
                        canvas.height = outputHeight;

                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;

                        ctx.drawImage(
                          img,
                          croppedAreaPixels.x,
                          croppedAreaPixels.y,
                          croppedAreaPixels.width,
                          croppedAreaPixels.height,
                          0,
                          0,
                          outputWidth,
                          outputHeight
                        );

                        canvas.toBlob((blob) => {
                          if (blob) {
                            const croppedFile = new File([blob], "profile.jpg", {
                              type: "image/jpeg",
                            });

                            setFile(croppedFile);
                            setImageSrc(null);
                            toast.success("Profile photo saved ✔");
                          }
                        }, "image/jpeg");
                      }}
                      className="mt-4 w-full bg-[#6A0000] text-white py-2 rounded-lg"
                    >
                      Save Photo
                    </button>

                    {/* Cancel */}
                    <button
                      type="button"
                      onClick={() => setImageSrc(null)}
                      className="mt-2 w-full border border-gray-300 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </div>
              )}
            </div>

            <div className="text-center pt-8 grid md:grid-cols-2 gap-6">

              {/* 💳 ONLINE PAYMENT */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleOnlinePayment}
                disabled={submitting || !isFormValid}
                className={`
                  relative group px-10 py-4 rounded-full
                  text-lg font-semibold text-white
                  transition-all duration-300 overflow-hidden
                  ${
                    submitting || !isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#6A0000] via-[#8B0000] to-[#A00000] shadow-xl hover:shadow-2xl"
                  }
                `}
              >
                Pay ₹1100 & Register
              </motion.button>

              {/* 🧾 OFFLINE PAYMENT */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleOfflineSubmit}
                disabled={submitting || !isFormValid}
                className={`
                  relative group px-10 py-4 rounded-full
                  text-lg font-semibold text-white
                  transition-all duration-300 overflow-hidden
                  ${
                    submitting || !isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 shadow-xl hover:shadow-2xl"
                  }
                `}
              >
                Already Paid
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