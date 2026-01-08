"use client";

import { motion } from "framer-motion";
import { Users, Heart, BookOpen, Layers, Phone, Download } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function PulakManchPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FAE3A3]/30 to-[#FFF8E7] text-[#4B1E00]">

      {/* HERO */}
      <header className="relative overflow-hidden py-28 px-6 text-center bg-gradient-to-b from-[#FFF1C1]/70 via-[#FFF8E7] to-transparent">
        
        {/* glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,120,0.35),transparent_65%)]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* floating particles */}
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

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-4 mb-6"
          >
            {/* LOGO */}
            <motion.img
              src="/images/logo/pulakmanch.PNG"
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
              Pulak Manch Parivar
            </h1>
          </motion.div>


          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            className="h-[2px] w-48 mx-auto mb-6 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed"
          >
            A nationwide spiritual and service-oriented youth movement inspired
            by the vision and blessings of{" "}
            <strong>Acharya Shri Pulak Sagar Ji Maharaj</strong>,
            dedicated to discipline, character building, selfless service, and
            national consciousness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-amber-700 font-semibold tracking-wide"
          >
            Breaking Not… Linking is Our Identity
          </motion.div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 pb-24 space-y-20">

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
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[{
            icon: <Layers />,
            title: "Organizations Under Pulak Manch",
            items: [
              "Akhil Bharatiya Pulak Jan Chetna Manch (Regd.)",
              "Rashtriya Jain Mahila Jagriti Manch (Regd.)",
              "Pulak Manch – Youth Wing",
              "Pulak Manch – Girls Wing",
              "Pulak Manch – Senior Group",
              "Pulak Manch – Little Champs",
            ],
          },{
            icon: <Users />,
            title: "Membership Categories",
            items: [
              "Adult Members",
              "Children & Students",
              "Little Champs (Free Membership)",
            ],
          }].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(251,191,36,0.25)" }}
              className="bg-amber-50 p-8 rounded-2xl border border-amber-200"
            >
              <div className="mb-3">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <ul className="space-y-2">
                {card.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
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

          <p className="text-lg leading-relaxed mb-8">
            • One-time Registration / Application Fee: <strong>₹1100 per member</strong><br />
            • Little Champs: <strong>Free</strong><br />
            • Monthly & Annual contributions are decided locally by each unit.
          </p>

          <motion.a
            href="/forms/pulak-manch-registration-form.pdf"
            download
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ["0 0 0px #fbbf24", "0 0 30px #fbbf24", "0 0 0px #fbbf24"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-8 py-4 rounded-full font-semibold shadow-lg"
          >
            <Download size={20} />
            Download Registration Form (PDF)
          </motion.a>
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
          className="bg-white/70 p-10 rounded-3xl shadow-xl border border-amber-200"
        >
          <h2 className="text-2xl font-serif font-semibold mb-6">
            Contact & Offices
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div>
              <strong>National Office</strong><br />
              Vatsalya Bhawan, P-75, Gali No. 5,<br />
              Bihari Colony Ext., Shahdara, Delhi – 32<br />
              📞 9810900699
            </div>
            <div>
              <strong>National Support Office</strong><br />
              Shri Digambar Jain Tirthdham,<br />
              Mumbai–Surat Highway, Umargam Post,<br />
              Talasari, Palghar (MH) – 401606<br />
              📞 7987176553
            </div>
          </div>
        </motion.section>

      </main>
    </section>
  );
}
