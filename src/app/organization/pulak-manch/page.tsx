"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Heart, BookOpen, Layers, Phone, Download } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function PulakManchPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FAE3A3]/30 to-[#FFF8E7] text-[#4B1E00]">

      {/* HERO */}
      <header className="relative overflow-hidden py-24 px-6 bg-gradient-to-br from-[#FFF3C4] via-[#FFF8E7] to-[#FFE7B3]">

        {/* decorative blur shapes */}
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-amber-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left space-y-6"
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight">
              Pulak Manch <br />
              <span className="text-amber-700">Parivar</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-xl">
              A nationwide spiritual and service-oriented youth movement inspired
              by the blessings of{" "}
              <strong>Acharya Shri Pulak Sagar Ji Maharaj</strong>,
              dedicated to discipline, character building and national consciousness.
            </p>

            <div className="text-amber-800 font-semibold tracking-wide">
              Breaking Not… Linking is Our Identity
            </div>
          </motion.div>

          {/* RIGHT IMAGE - MAHARAJ JI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center items-center"
          >

            {/* Golden Aura */}
            <div className="absolute w-80 h-80 bg-gradient-to-r from-amber-300/40 via-yellow-300/40 to-orange-300/40 rounded-full blur-3xl animate-pulse" />

            {/* Glass Frame */}
            <div className="relative p-3 rounded-3xl bg-white/40 backdrop-blur-md shadow-2xl border border-amber-200">
              <Image
                src="/images/gallery/maharaj/img4.jpeg"
                alt="Acharya Shri Pulak Sagar Ji Maharaj"
                width={420}
                height={520}
                className="rounded-2xl object-cover"
                priority
              />
            </div>

          </motion.div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto py-20 px-6 pb-24 space-y-20">

        {/* ABOUT */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-amber-200"
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">
            About Pulak Manch Parivar
          </h2>
          <p className="text-lg leading-relaxed text-justify">
            Pulak Manch Parivar is not a crowd driven by emotional gatherings,
            but a disciplined collective of dedicated volunteers working under
            the guidance of Gurudev’s philosophy of compassion, simplicity, and
            service. Since 1997, this movement has transformed youthful energy
            into organized, value-based social service across India.
          </p>
        </motion.section>

        {/* ORGANIZATIONS + MEMBERSHIP */}
        <motion.section
          className="grid md:grid-cols-2 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: <Layers size={26} className="text-amber-700" />,
              title: "Organizations Under Pulak Manch",
              items: [
                "Akhil Bharatiya Pulak Jan Chetna Manch (Regd.)",
                "Rashtriya Jain Mahila Jagriti Manch (Regd.)",
                "Pulak Manch – Youth Wing",
                "Pulak Manch – Girls Wing",
                "Pulak Manch – Senior Group",
                "Pulak Manch – Little Champs",
              ],
            },
            {
              icon: <Users size={26} className="text-amber-700" />,
              title: "Membership Categories",
              items: [
                "Adult Members",
                "Children & Students",
                "Little Champs (Free Membership)",
              ],
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-amber-200"
            >
              <div className="flex items-center gap-3 mb-6">
                {card.icon}
                <h3 className="text-2xl font-semibold">{card.title}</h3>
              </div>

              <div className="grid gap-4">
                {card.items.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-amber-50 to-white p-4 rounded-xl shadow border border-amber-100 hover:shadow-md transition"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.section>


        {/* MEMBERSHIP & DOWNLOAD */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/70 p-10 rounded-3xl shadow-xl border border-amber-200 text-center"
        >
          <h2 className="text-2xl font-serif font-semibold mb-4">
            Membership & Contribution
          </h2>

          <p className="text-lg leading-relaxed mb-10">
            • One-time Registration / Application Fee: <strong>₹1100 per member</strong><br />
            • Little Champs: <strong>Free</strong><br />
            • Monthly & Annual contributions are decided locally by each unit.
          </p>

          {/* DOWNLOAD FORMS */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* GENERAL FORM */}
            <motion.a
              href="/forms/membership_form.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="
                group bg-gradient-to-br from-amber-500 to-yellow-400
                text-white p-6 rounded-2xl
                shadow-lg hover:shadow-2xl
                transition-all
              "
            >
              <Download className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold">Pulak Manch</h3>
              <p className="text-sm opacity-90">Membership Form</p>
            </motion.a>

            {/* JMJM – LADIES */}
            <motion.a
              href="/forms/JMJM.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="
                group bg-gradient-to-br from-pink-500 to-rose-400
                text-white p-6 rounded-2xl
                shadow-lg hover:shadow-2xl
                transition-all
              "
            >
              <Download className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold">JMJM</h3>
              <p className="text-sm opacity-90">
                Ladies Membership Form
              </p>
            </motion.a>

            {/* PJCM – GENTS */}
            <motion.a
              href="/forms/PJCM.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="
                group bg-gradient-to-br from-blue-600 to-indigo-500
                text-white p-6 rounded-2xl
                shadow-lg hover:shadow-2xl
                transition-all
              "
            >
              <Download className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold">PJCM</h3>
              <p className="text-sm opacity-90">
                Gents Membership Form
              </p>
            </motion.a>
          </div>
          <div className="flex justify-center mt-10">
            <motion.a
              href="/organization/pulak-manch/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="
                relative group inline-flex items-center justify-center
                px-12 py-4 rounded-full
                text-lg font-semibold text-white
                bg-gradient-to-r from-[#6A0000] via-[#8B0000] to-[#A00000]
                shadow-xl hover:shadow-2xl
                transition-all duration-300
                overflow-hidden
              "
            >
              {/* Glow */}
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-300/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />

              {/* Shine */}
              <span className="absolute left-[-100%] top-0 h-full w-1/2 bg-white/20 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" />

              <span className="relative flex items-center gap-3">
                Register Online
              </span>
            </motion.a>
          </div>
        </motion.section>

        {/* VALUES */}
        <motion.section className="grid md:grid-cols-3 gap-8">
          {[{
            icon: <Heart />, title: "Service & Compassion",
            text: "Transforming service-oriented thoughts into consistent action for society."
          },{
            icon: <BookOpen />, title: "Personal Development",
            text: "Building discipline, leadership, and spiritual awareness in youth."
          },{
            icon: <Users />, title: "Identity & Recognition",
            text: "Creating a meaningful identity through teamwork and responsibility."
          }].map((v, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              className="bg-amber-50 p-8 rounded-2xl border border-amber-200 text-center"
            >
              <div className="mb-3 flex justify-center">{v.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p>{v.text}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* CONTACT */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white to-amber-50 p-12 rounded-3xl shadow-2xl border border-amber-200"
        >
          <h2 className="text-3xl font-serif font-semibold mb-12 text-center">
            Contact & Offices
          </h2>

          <div className="grid md:grid-cols-2 gap-10 text-center">

            {/* National Office */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white p-10 rounded-2xl shadow-lg border border-amber-200"
            >
              <h3 className="text-xl font-semibold mb-6 text-amber-800">
                National Office
              </h3>

              <div className="space-y-2 text-sm leading-relaxed">
                <p className="text-amber-800">Vatsalya Bhawan</p>
                <p>P-75, Street Number 5, Bihari Colony Extension,</p>
                <p>Bihari Colony, Shahdara,</p>
                <p>Delhi – 110032</p>

                <div className="pt-4 space-y-2 flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-amber-700" />
                    9810900699
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-amber-700" />
                    9810900042
                  </div>
                </div>
              </div>
            </motion.div>

            {/* National Support Office */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white p-10 rounded-2xl shadow-lg border border-amber-200"
            >
              <h3 className="text-xl font-semibold mb-6 text-amber-800">
                National Support Office
              </h3>

              <div className="space-y-2 text-sm leading-relaxed">
                <p className="text-amber-800">Shri Digambar Jain Jinsharnam Tirth Trust (Regd.)</p>
                <p>Mumbai-Surat Highway No 48, Uplat,</p>
                <p>Tehsil Talasari, District Palghar,</p>
                <p>Maharashtra – 401606</p>

                <div className="pt-4 space-y-2 flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-amber-700" />
                    7987176553
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-amber-700" />
                    8799598079
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.section>

      </main>
    </section>
  );
}
