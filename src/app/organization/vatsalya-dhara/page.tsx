"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Truck,
  BookOpen,
  Activity,
  Layers,
  Phone,
  ClipboardCopy,
  Download,
} from "lucide-react";

/**
 * Vatsalya Dhara Page (English Version)
 * - Summary content + Posters input integrated
 * - Polished Donation Section
 * - QR at /public/images/vatsalya_qr.jpg
 */

export default function VatsalyaDharaPage() {
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const donation = {
    accountName: "VATSALYA DHARA TRUST (REGD.)",
    accountNumber: "925010022258145",
    ifsc: "UTIB0005638",
    bankName: "AXIS BANK Ltd.",
    branch: "BHOLANATH NAGAR, DELHI",
    contacts: ["9910987666", "9810900699"],
    qrPath: "/images/donation/vatsalya_qr.jpeg",
    upiId: "",
  };

  const copy = async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg(`${label ?? "Copied"} ✓`);
      setTimeout(() => setCopyMsg(null), 2200);
    } catch {
      setCopyMsg("Copy failed");
      setTimeout(() => setCopyMsg(null), 2200);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FAE3A3]/30 to-[#FFF8E7] text-[#4B1E00]">
      
      {/* HERO */}
      <header className="py-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
        >
          Vatsalya Dhara
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="max-w-3xl mx-auto text-lg md:text-xl text-[#4B1E00]/90 leading-relaxed"
        >
          Guided by the blessings of <strong>Acharya Shri Pulak Sagar Ji Maharaj</strong>, 
          Vatsalya Dhara is a movement dedicated to compassion, service and human welfare —
          focused on education, healthcare, animal care, emergency support, and community upliftment.
        </motion.p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20 space-y-12">

        {/* MISSION */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Heart size={44} className="text-rose-500 shrink-0" />
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-2">
                Our Mission
              </h2>
              <p className="text-[#4B1E00]/90 text-lg leading-relaxed text-justify">
                To promote humanity, compassion, and value-based living through 
                impactful service projects. We support those in need with food, 
                healthcare, education, animal care, emergency help, and shelter 
                for the elderly and orphans.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* 1. Youth Empowerment */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
            <img
              src="/images/vatsalya/youth.jpg"
              alt="Youth Empowerment"
              className="w-full h-50 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center gap-3 mb-3">
              <Users size={26} />
              <h3 className="text-xl font-semibold">Youth Empowerment</h3>
            </div>
            <p className="text-[#4B1E00]/90 text-justify">
              Leadership, discipline, and value-based education programs for youth.
            </p>
          </div>

          {/* 2. Education */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
            <img
              src="/images/vatsalya/education.jpeg"
              alt="Education"
              className="w-full h-50 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center gap-3 mb-3">
              <BookOpen size={26} />
              <h3 className="text-xl font-semibold">Education</h3>
            </div>
            <p className="text-[#4B1E00]/90 text-justify">
              Free education for underprivileged children, book donation drives, and Jain library preservation.
            </p>
          </div>

          {/* 3. Free Health Camps */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
            <img
              src="/images/vatsalya/healthcamp.jpeg"
              alt="Free Health Camps"
              className="w-full h-50 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center gap-3 mb-3">
              <Activity size={26} />
              <h3 className="text-xl font-semibold">Free Health Camps</h3>
            </div>
            <p className="text-[#4B1E00]/90 text-justify">
              Medical checkups, free medicines, elderly support, and healthcare awareness.
            </p>
          </div>

          {/* 4. Ambulance Service */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
            <img
              src="/images/vatsalya/ambulance.jpeg"
              alt="Ambulance Service"
              className="w-full h-50 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center gap-3 mb-3">
              <Truck size={26} />
              <h3 className="text-xl font-semibold">Ambulance Service</h3>
            </div>
            <p className="text-[#4B1E00]/90 text-justify">
              Quick-response ambulance assistance ensuring patients reach hospitals on time.
            </p>
          </div>

          {/* 5. Gau Seva & Animal Care */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
            <img
              src="/images/vatsalya/animals.jpeg"
              alt="Gau Seva & Animal Care"
              className="w-full h-50 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center gap-3 mb-3">
              <Layers size={26} />
              <h3 className="text-xl font-semibold">Gau Seva & Animal Care</h3>
            </div>
            <p className="text-[#4B1E00]/90 text-justify">
              Cow shelters, feeding birds & animals, and compassion for all living creatures.
            </p>
          </div>

          {/* 6. Elderly & Orphan Support */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
            <img
              src="/images/vatsalya/elderly.jpeg"
              alt="Elderly & Orphan Support"
              className="w-full h-50 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center gap-3 mb-3">
              <Phone size={26} />
              <h3 className="text-xl font-semibold">Elderly & Orphan Support</h3>
            </div>
            <p className="text-[#4B1E00]/90 text-justify">
              Shelter, support, and regular care for senior citizens and orphaned children.
            </p>
          </div>
        </motion.section>


        {/* FEATURE SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 p-8 rounded-2xl shadow-lg border border-amber-200 flex flex-col md:flex-row gap-6 items-center"
        >
          <img
            src="/images/vatsalya/poster.jpeg"
            alt="Service Poster"
            className="md:w-60 h-46 object-cover rounded-lg shadow-sm border"
          />

          <div className="w-full md:w-2/3">
            <h3 className="text-2xl font-serif font-semibold mb-3">
              Taking Steps Towards Humanity…
            </h3>
            <p className="text-lg text-[#4B1E00]/90 leading-relaxed text-justify">
              Through multiple initiatives—food distribution, health camps, cow shelter support,
              education projects and emergency assistance—Vatsalya Dhara continues to help people 
              live with dignity. Even small contributions make a great difference.
            </p>

            <div className="mt-4 flex gap-3 flex-wrap">
              <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">Annadaan</span>
              <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">Health Camps</span>
              <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">Gau Seva</span>
              <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">Ambulance</span>
            </div>
          </div>
        </motion.section>

        {/* HOW TO HELP */}
        {/*<motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 p-8 rounded-2xl shadow-lg border border-amber-200"
        >
          <h3 className="text-2xl font-serif font-semibold mb-3">How You Can Help</h3>
          <ul className="list-disc list-inside text-lg text-[#4B1E00]/90 space-y-2">
            <li>Volunteer during food distribution or medical camps.</li>
            <li>Support cow shelters or stray animal feeding drives.</li>
            <li>Donate books or essentials to support education.</li>
            <li>Assist with emergency and ambulance services.</li>
            <li>Spread awareness and bring more volunteers.</li>
          </ul>
        </motion.section>*/}

        {/* CONTACT */}
        {/*<motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 p-8 rounded-2xl shadow-lg border border-amber-200 text-center"
        >
          <h3 className="text-2xl font-serif font-semibold mb-2">Contact</h3>
          <p className="text-lg text-[#4B1E00]/90 mb-4">
            For volunteering, events or donation assistance:
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {donation.contacts.map((c) => (
              <a
                key={c}
                href={`tel:${c}`}
                className="bg-amber-100 px-4 py-2 rounded-full text-[#4B1E00] font-semibold shadow-sm hover:scale-105 transition"
              >
                {c}
              </a>
            ))}
          </div>
        </motion.section>*/}

        {/* DONATION SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-b from-amber-50 to-white p-8 rounded-2xl shadow-xl border border-amber-200"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-6">
            Support Vatsalya Dhara Trust
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* BANK TRANSFER */}
            <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Download size={18} /> Bank Transfer
              </h4>

              <div className="text-[#4B1E00] space-y-3">
                <p className="font-semibold">{donation.accountName}</p>

                {/* Account Number */}
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-[#4B1E00]/70">Account Number</p>
                    <p className="font-mono font-semibold">{donation.accountNumber}</p>
                  </div>
                  <button
                    onClick={() => copy(donation.accountNumber, "Account Number")}
                    className="ml-auto bg-amber-100 px-3 py-1 rounded-md text-sm flex items-center gap-2 hover:scale-105 transition"
                  >
                    <ClipboardCopy size={16} /> Copy
                  </button>
                </div>

                {/* IFSC */}
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-[#4B1E00]/70">IFSC Code</p>
                    <p className="font-mono font-semibold">{donation.ifsc}</p>
                  </div>
                  <button
                    onClick={() => copy(donation.ifsc, "IFSC Code")}
                    className="ml-auto bg-amber-100 px-3 py-1 rounded-md text-sm flex items-center gap-2 hover:scale-105 transition"
                  >
                    <ClipboardCopy size={16} /> Copy
                  </button>
                </div>

                <p className="text-sm"><strong>Bank:</strong> {donation.bankName}</p>
                <p className="text-sm"><strong>Branch:</strong> {donation.branch}</p>
              </div>
            </div>

            {/* UPI / QR */}
            <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ClipboardCopy size={18} /> UPI / QR
              </h4>

              <div className="bg-white rounded-lg border border-amber-300 p-4 shadow-md">
                <img
                  src={donation.qrPath}
                  alt="Vatsalya QR"
                  className="w-64 h-64 md:w-72 md:h-72 object-contain"
                />
              </div>

              {!donation.upiId ? (
                <p className="text-sm text-[#4B1E00]/80 mt-4">
                  Scan the QR code using any UPI app (GPay, PhonePe, Paytm, BHIM).
                </p>
              ) : (
                <>
                  <p className="text-sm mt-4">UPI ID</p>
                  <p className="text-2xl font-semibold text-amber-700">{donation.upiId}</p>
                  <button
                    onClick={() => copy(donation.upiId, "UPI ID")}
                    className="mt-3 bg-amber-100 px-4 py-2 rounded-full text-sm shadow-sm inline-flex items-center gap-2"
                  >
                    <ClipboardCopy size={14} /> Copy UPI
                  </button>
                </>
              )}

              <div className="mt-4 flex gap-3">
                {donation.contacts.map((c) => (
                  <a
                    key={c}
                    href={`tel:${c}`}
                    className="bg-amber-100 px-3 py-1 rounded-full text-sm"
                  >
                    {c}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {copyMsg && (
            <div className="mt-4 text-center text-sm text-green-700">
              {copyMsg}
            </div>
          )}
        </motion.section>
      </main>
    </section>
  );
}
