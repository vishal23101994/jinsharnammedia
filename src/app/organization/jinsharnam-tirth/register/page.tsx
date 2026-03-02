"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { useRouter } from "next/navigation";

/* ================= OPTIONS ================= */

const designations = [
  "Adhyaksh","Karyadhyaksh","Koshyadhyaksh",
  "Mahamantri","Mantri","Param Sanrakshak","Sanghpati and Sanrakshak Shiromani","Sanrakshak Shiromani",
  "Sanyojak","Trustee","Upadhyaksh","Other"
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

export default function RegisterPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    gender: "",
    dateOfBirth: "",
    dateOfMarriage: "",
    designation: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [otherState, setOtherState] = useState("");
  const [otherDesignation, setOtherDesignation] = useState("");

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locationLocked, setLocationLocked] = useState(false);
  const router = useRouter();

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.gender.trim() !== "" &&
    form.designation.trim() !== "" &&
    form.dateOfBirth.trim() !== "" &&
    form.address.trim() !== "" &&
    form.city.trim() !== "" &&
    form.state.trim() !== "" &&
    form.pincode.trim() !== "" &&
    locationLocked &&
    file !== null;   // 🔥 PHOTO REQUIRED

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      const fd = new FormData();

      const finalDesignation =
        form.designation === "Other" ? otherDesignation : form.designation;

      const finalState =
        form.state === "Other" ? otherState : form.state;

      fd.append("name", form.name);
      fd.append("email", form.email.toLowerCase());
      fd.append("phone", form.phone);
      fd.append("alternatePhone", form.alternatePhone);
      fd.append("gender", form.gender);
      fd.append("designation", finalDesignation);
      fd.append("address", form.address);
      fd.append("city", form.city);
      fd.append("state", finalState);
      fd.append("pincode", form.pincode);
      fd.append("dateOfBirth", form.dateOfBirth);

      if (form.dateOfMarriage)
        fd.append("dateOfMarriage", form.dateOfMarriage);

      if (file) fd.append("photo", file);

      const res = await fetch("/api/trustee/register", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Something went wrong");
        setSubmitting(false);
        return;
      }

      toast.success("Submitted for Approval ✅");
      router.push("/pending");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function detectStateFromPincode(pin: string) {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setLocationLocked(false);
      return;
    }

    try {
      toast.loading("Detecting location...", { id: "stateDetect" });

      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      );

      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setForm((prev) => ({
          ...prev,
          state: postOffice.State,
          city: postOffice.District,
        }));

        setLocationLocked(true);

        toast.success("State & City auto detected ✔", {
          id: "stateDetect",
        });
      } else {
        setLocationLocked(false);
        toast.error("Invalid pincode", { id: "stateDetect" });
      }
    } catch {
      setLocationLocked(false);
      toast.error("Could not detect location", {
        id: "stateDetect",
      });
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF3C4] via-[#FFF8E7] to-[#FFE7B3] py-20 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/jinsharnamtirth.png"
              alt="Jinsharnam Logo"
              width={120}
              height={120}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-[#6A0000] mb-4">
            Trustee Registration
          </h1>

          <div className="w-24 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto mb-4" />

          <p className="text-lg text-[#4B1E00] max-w-2xl mx-auto">
            Apply to become a trustee of Shri Digambar Jain Jinsharnam Tirth Trust.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-2xl p-10"
        >

          <form
            className="space-y-8"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!isFormValid) return;
              await handleSubmit();
            }}
          >

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
                <Input icon={<Phone size={18}/>} placeholder="Alternate Mobile (Optional)"
                  value={form.alternatePhone}
                  onChange={(v:string)=>setForm({...form,alternatePhone:v})}
                />

                <Input icon={<MapPin size={18}/>} placeholder="Address"
                  value={form.address}
                  onChange={(v:string)=>setForm({...form,address:v})}
                />
                <Input icon={<MapPin size={18}/>} placeholder="Pincode"
                  value={form.pincode}
                  onChange={(v:string)=>{
                    setForm({...form,pincode:v});
                    detectStateFromPincode(v);
                  }}
                />
                <Input
                  icon={<Building2 size={18}/>}
                  placeholder="City"
                  value={form.city}
                  onChange={(v:string)=>setForm({...form,city:v})}
                  disabled={locationLocked}
                />
                <Select
                  value={form.state}
                  onChange={(v:string)=>setForm({...form,state:v})}
                  options={indianStates}
                  placeholder="Select State"
                  disabled={locationLocked}
                />

                {form.state === "Other" && (
                  <Input
                    placeholder="Enter State"
                    value={otherState}
                    onChange={(v:string)=>setOtherState(v)}
                  />
                )}
                <Select value={form.designation}
                  onChange={(v:string)=>setForm({...form,designation:v})}
                  options={designations}
                  placeholder="Select Designation"
                />

                {form.designation === "Other" && (
                  <Input
                    placeholder="Enter Designation"
                    value={otherDesignation}
                    onChange={(v:string)=>setOtherDesignation(v)}
                  />
                )}

                <Select
                  value={form.gender}
                  onChange={(v:string)=>setForm({...form,gender:v})}
                  options={["Male","Female"]}
                  placeholder="Select Gender"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#6A0000]">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(v:string)=>setForm({...form,dateOfBirth:v})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#6A0000]">
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

            {/* DESIGNATION & DETAILS */}
            <div className="grid md:grid-cols-2 gap-6">

              

            </div>

            {/* PHOTO */}
            <div>
              <h2 className="text-xl font-semibold text-[#6A0000] mb-4">
                Profile Photo
              </h2>

              <label htmlFor="photoUpload" className="flex flex-col items-center justify-center border-2 border-dashed border-amber-400 rounded-2xl p-10 bg-white/60 hover:bg-amber-50 transition cursor-pointer text-center">
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e)=>{
                    const selected = e.target.files?.[0];
                    if (!selected) return;
                    const reader = new FileReader();
                    reader.onload = ()=>setImageSrc(reader.result as string);
                    reader.readAsDataURL(selected);
                  }}
                  className="hidden"
                />
                {file ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-amber-400"
                  />
                ) : (
                  <div className="text-lg text-[#4B1E00]">
                    Click to choose file
                  </div>
                )}
              </label>

              {imageSrc && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <motion.div className="bg-white rounded-3xl shadow-2xl w-[460px] p-8">
                    <div className="relative w-full max-w-[360px] h-[420px] mx-auto rounded-xl overflow-hidden">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={3/4}
                        cropShape="rect"
                        showGrid
                        restrictPosition={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, pixels)=>setCroppedAreaPixels(pixels)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={async ()=>{
                        if (!croppedAreaPixels) return;
                        const canvas = document.createElement("canvas");
                        const img = new window.Image();
                        img.src = imageSrc!;
                        await new Promise(resolve=>img.onload=resolve);

                        canvas.width = 360;
                        canvas.height = 460;

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
                          360,
                          460
                        );

                        canvas.toBlob(blob=>{
                          if (!blob) return;
                          setFile(new File([blob],"profile.jpg",{type:"image/jpeg"}));
                          setImageSrc(null);
                          toast.success("Profile photo saved ✔");
                        },"image/jpeg");
                      }}
                      className="mt-4 w-full bg-[#6A0000] text-white py-2 rounded-lg"
                    >
                      Save Photo
                    </button>

                    <button
                      type="button"
                      onClick={()=>setImageSrc(null)}
                      className="mt-2 w-full border py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </div>
              )}
            </div>

            <div className="text-center pt-8">
              <motion.button
                whileHover={{ scale: isFormValid ? 1.05 : 1 }}
                whileTap={{ scale: isFormValid ? 0.97 : 1 }}
                type="submit"
                disabled={!isFormValid || submitting}
                className={`px-10 py-4 rounded-full text-white shadow-xl transition
                  ${
                    isFormValid
                      ? "bg-gradient-to-r from-[#6A0000] to-[#A00000]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Submit for Approval
              </motion.button>
            </div>

          </form>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= REUSABLE INPUT ================= */

function Input({ icon, placeholder, value, onChange, type="text", disabled=false }: any) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A0000]">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e)=>onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border 
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white/80"}
        border-amber-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition`}
      />
    </div>
  );
}

function Select({ value, onChange, options, placeholder, disabled=false }: any) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e)=>onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-xl border 
      ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white/80"}
      border-amber-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition`}
    >
      <option value="">{placeholder}</option>
      {options.map((o:any)=>(
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}