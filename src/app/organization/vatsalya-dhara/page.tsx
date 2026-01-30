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
  const [isPaused, setIsPaused] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const donation = {
    accountName: "VATSALYA DHARA TRUST (REGD.)",
    accountNumber: "925010022258145",
    ifsc: "UTIB0005638",
    pan: "AABTV5574B",
    bankName: "AXIS BANK Ltd.",
    branch: "BHOLANATH NAGAR, DELHI",
    contacts: ["9910987666", "9810900699"],
    qrPath: "/images/donation/vatsalya_qr.jpeg",
    upiId: "",
  };

  const trustees = [
    {
      role: "अध्यक्ष",
      name: "सीमा जैन",
      address:
        "D-49 बी, ललिता पार्क, शकरपुर एक्सटें., लक्ष्मी नगर, दिल्ली - 110092",
      phone: "9625604001",
    },
    {
      role: "महामंत्री",
      name: "अंकित जैन ‘प्रिंस’",
      address:
        "पुलक निवास, 4/2771, गली नं. 3, बिहारी कॉलोनी, शाहदरा, दिल्ली - 32",
      phone: "9810900699",
    },
    {
      role: "कोषाध्यक्ष",
      name: "संदीप जैन",
      address: "मकान नं. 1154, सेक्टर-16, फरीदाबाद (हरि.)",
      phone: "9810772312",
    },
    {
      role: "ट्रस्टी",
      name: "राजू व्यास",
      address: "116, लख्मी की पोल, जोधपुर (राज.)",
      phone: "9414243770",
    },
  ];

  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const videos = [
    { src: "/videos/vatsalya/1.mp4", title: "Annadaan Seva" },
    { src: "/videos/vatsalya/2.mp4", title: "Health Camp" },
    { src: "/videos/vatsalya/3.mp4", title: "Gau Seva" },
    { src: "/videos/vatsalya/4.mp4", title: "Youth Empowerment" },
    { src: "/videos/vatsalya/5.mp4", title: "Ambulance Seva" },
    { src: "/videos/vatsalya/6.mp4", title: "Education Drive" },
    { src: "/videos/vatsalya/7.mp4", title: "Food Distribution" },
    { src: "/videos/vatsalya/8.mp4", title: "Medical Support" },
    { src: "/videos/vatsalya/9.mp4", title: "Community Help" },
    { src: "/videos/vatsalya/10.mp4", title: "Spiritual Seva" },
  ];


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
      
      {/* DIVINE HERO */}
      <header className="relative overflow-hidden py-24 px-6 text-center bg-gradient-to-b from-[#FFF1C1]/70 via-[#FFF8E7] to-transparent">

        {/* soft radial glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,120,0.25),transparent_65%)]" />

        {/* subtle floating particles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-300/60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </motion.div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-4 mb-6"
          >
            {/* LOGO */}
            <motion.img
              src="/images/logo/vatsalya.png"
              alt="Pulak Manch Logo"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                opacity: 1,
                scale: [1, 1.06, 1],
                rotate: [0, 1.5, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.2 },
                scale: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-xl"
              style={{
                filter: "drop-shadow(0 0 10px rgba(251,191,36,0.6))",
              }}
            />

            {/* TITLE */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-center">
              Vatsalya Dhara Trust
            </h1>
          </motion.div>

          {/* Lotus Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mb-6"
          >
            <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[#4B1E00]/90 text-justify md:text-center"
          >
            Guided by the blessings of{" "}
            <span className="font-semibold text-amber-800">
              Acharya Shri Pulak Sagar Ji Maharaj
            </span>,{" "}
            Vatsalya Dhara is a movement rooted in compassion, selfless service,
            and human welfare — nurturing education, healthcare, animal care,
            emergency support, and community upliftment.
          </motion.p>

          {/* Blessing Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 text-sm text-amber-700 tracking-wide"
          >
            सेवा • करुणा • मानवता
          </motion.div>

        </div>
        {/* FREE-FLOATING CTA BUTTONS */}
        <div className="mt-10 text-center space-y-6">

          {/* VISIT WEBSITE */}
          <a
            href="https://www.vatsalyadharatrust.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-3
              px-10 py-3
              rounded-full
              text-lg font-semibold
              border-2 border-amber-500
              text-amber-900
              bg-white/80
              hover:bg-amber-100
              hover:scale-105
              transition-all duration-300
              shadow-lg
            "
          >
            🌐 Visit "Vatsalya Dhara Trust" Website
          </a>

          {/* DONATE */}
          <div>
            <button
              onClick={() =>
                document
                  .getElementById('donate-section')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="
                relative
                px-14 py-4
                text-xl font-bold
                rounded-full
                text-[#4B1E00]
                bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300
                shadow-[0_0_55px_rgba(251,191,36,0.95)]
                hover:shadow-[0_0_85px_rgba(251,191,36,1)]
                hover:scale-110
                transition-all duration-300
                overflow-hidden
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shine_2.5s_infinite]" />
              🙏 Donate Now
            </button>
          </div>

        </div>
      </header>

      {/* SACRED HORIZONTAL SCROLL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1C1] to-transparent py-14">

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FFF1C1] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FFF1C1] to-transparent z-10" />

        <motion.div
          className="flex gap-8 w-max px-8"
          animate={isPaused ? { x: undefined } : { x: ["0%", "-50%"] }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...Array(2)].map((_, loopIndex) =>
            [1,2,3,4,5,6,7,8,9].map((imgNo) => (
              <motion.div
                key={`${loopIndex}-${imgNo}`}   // ✅ UNIQUE KEY
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative shrink-0 cursor-zoom-in"
                onClick={() => setZoomImage(`/images/vatsalya/${imgNo}.jpeg`)}
              >
                <img
                  src={`/images/vatsalya/${imgNo}.jpeg`}
                  alt="Vatsalya Dhara Seva"
                  className="
                    w-[260px] md:w-[300px]
                    h-[380px] md:h-[440px]
                    object-cover
                    rounded-3xl
                    shadow-2xl
                    border border-amber-200
                  "
                />

                {/* spiritual overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/25 to-transparent" />
              </motion.div>
            ))
          )}
        </motion.div>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setZoomImage(null)}
          >
            <motion.img
              src={zoomImage}
              alt="Zoomed Seva"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="
                max-w-[90vw]
                max-h-[90vh]
                rounded-2xl
                shadow-2xl
                border border-amber-300
                cursor-zoom-out
              "
            />
          </motion.div>
        )}
      </section>

      {/* SEVA IN MOTION – SACRED VIDEO SCROLL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1C1] to-transparent py-16">

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FFF1C1] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FFF1C1] to-transparent z-10" />

        <h3 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-10">
          Vatsalya Dhara Trust
        </h3>

        <motion.div
          className="flex gap-8 w-max px-8"
          animate={isVideoPaused ? { x: undefined } : { x: ["0%", "-50%"] }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          onMouseEnter={() => setIsVideoPaused(true)}
          onMouseLeave={() => setIsVideoPaused(false)}
        >

          {[...Array(2)].map((_, loopIndex) =>
            videos.map((video, index) => (
              <motion.div
                key={`${loopIndex}-${index}`}
                whileHover={{ scale: 1.05 }}
                className="relative shrink-0 w-[320px] h-[200px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-amber-200"
                onClick={() => setActiveVideo(index)}
              >
                {/* Thumbnail video (muted preview only) */}
                <video
                  src={video.src}
                  muted
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* play icon */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                    ▶
                  </div>
                </motion.div>

                {/* title */}
                <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold">
                  {video.title}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        {activeVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* VIDEO PLAYER */}
              <video
                src={videos[activeVideo].src}
                controls
                autoPlay
                playsInline
                className="w-full rounded-2xl shadow-2xl"
              />

              {/* TITLE */}
              <p className="text-center text-white mt-4 text-lg font-semibold">
                {videos[activeVideo].title}
              </p>

              {/* NAVIGATION */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() =>
                    setActiveVideo(
                      (activeVideo - 1 + videos.length) % videos.length
                    )
                  }
                  className="bg-amber-100 px-5 py-2 rounded-full font-medium"
                >
                  ⟵ Previous
                </button>

                <button
                  onClick={() =>
                    setActiveVideo((activeVideo + 1) % videos.length)
                  }
                  className="bg-amber-100 px-5 py-2 rounded-full font-medium"
                >
                  Next ⟶
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>


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
            src="/images/logo/vatsalya.png"
            alt="Vatsalya Dhara Trust Logo"
            className="
              w-40 md:w-44
              h-40 md:h-44
            "
            style={{
              filter: "drop-shadow(0 0 10px rgba(251,191,36,0.4))",
            }}
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

        {/* TRUSTEE SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-amber-200"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-10">
            Vatsalya Dhara Trust (Regd.)
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {trustees.map((t) => (
              <div
                key={t.name}
                className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm text-center"
              >
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  {t.role}
                </p>
                <h3 className="text-lg font-semibold mb-2">{t.name}</h3>

                <p className="text-sm text-[#4B1E00]/80 leading-relaxed mb-3">
                  {t.address}
                </p>

                <a
                  href={`tel:${t.phone}`}
                  className="inline-block bg-amber-100 px-3 py-1 rounded-full text-sm font-medium"
                >
                  📞 {t.phone}
                </a>
              </div>
            ))}
          </div>
        </motion.section>

        {/* DONATION SECTION */}
        <motion.section
          id="donate-section"
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
                Bank Transfer
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
                {/* IFSC */}
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-[#4B1E00]/70">PAN</p>
                    <p className="font-mono font-semibold">{donation.pan}</p>
                  </div>
                  <button
                    onClick={() => copy(donation.pan, "PAN")}
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
