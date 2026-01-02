"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* -------------------------------------------
  Animation variants
--------------------------------------------*/
const easeOutCubic = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: easeOutCubic,
    },
  }),
};

export default function AdvertisementCards() {
  return (
    <section
      className="
        relative py-36 overflow-hidden
        bg-gradient-to-b from-[#FFF8E7] via-[#FFEEC2] to-[#FAE3A3]/40
      "
    >
      {/* ✨ Floating spiritual dust */}
      {[...Array(14)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#FFD97A]/40 blur-md"
          style={{
            width: Math.random() * 10 + 4,
            height: Math.random() * 10 + 4,
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 7 + 6,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 🔱 Heading */}
      <div className="relative z-10 text-center mb-28">
        <h2 className="text-4xl md:text-5xl font-serif text-[#4B1E00]">
          Seva & Sahyog
        </h2>
        <p className="mt-4 italic text-[#4B1E00]/80">
          A humble offering towards Dharma, Sanskar & Sadhana
        </p>
      </div>

      {/* 🪷 Cards (ONLY TWO) */}
      <div
        className="
          relative z-10 max-w-6xl mx-auto px-6
          grid grid-cols-1 md:grid-cols-2 gap-16
          items-stretch justify-center
        "
      >
        {/* ---------------- CARD 1 ---------------- */}
        <TempleCard index={0}>
          <h3 className="text-2xl font-serif text-[#4B1E00] mb-4">
            Jinsharnam Tirth Trust
          </h3>

          <p className="text-[#4B1E00]/85 mb-8 leading-relaxed flex-1">
            Contribute towards the preservation and growth of the sacred Jain
            Tirth — a place of tapasya and peace.
          </p>

          <QR src="/images/donation/jinsharnam_qr1.jpg" />

          <FooterText />
        </TempleCard>

        {/* ---------------- CARD 2 ---------------- */}
        <TempleCard index={1}>
          <h3 className="text-2xl font-serif text-[#4B1E00] mb-4">
            Vatsalya Dhara Trust
          </h3>

          <p className="text-[#4B1E00]/85 mb-8 leading-relaxed flex-1">
            Your compassion transforms into food, care and dignity for the needy.
          </p>

          <QR src="/images/donation/vatsalya_qr.jpeg" />

          <FooterText />
        </TempleCard>
      </div>
    </section>
  );
}

/* ======================================================
   Reusable Temple Card Wrapper
====================================================== */
function TempleCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      whileHover={{ y: -14, scale: 1.01 }}
      className="
        relative h-full rounded-[2.8rem] p-[3px]
        bg-gradient-to-br from-[#C99A2C] via-[#FFE6A3] to-[#B8821E]
        shadow-[0_40px_100px_rgba(201,140,43,0.55)]
      "
    >
      {/* Inner parchment */}
      <div
        className="
          relative h-full rounded-[2.4rem] p-14
          bg-[radial-gradient(circle_at_top,#FFFDF6,#FFF1CF)]
          border border-[#E6C670]
          flex flex-col text-center overflow-hidden
        "
      >
        {/* Inner dotted manuscript frame */}
        <div
          className="
            absolute inset-6 rounded-[2rem]
            border border-dashed border-[#E2B85C]/60
            pointer-events-none
          "
        />

        {/* Soft breathing aura */}
        <motion.div
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="
            absolute inset-0
            bg-gradient-to-br from-[#FFD97A]/35 to-transparent
            blur-xl
          "
        />

        <div className="relative z-10 flex flex-col h-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ======================================================
   Small helpers
====================================================== */
function QR({ src }: { src: string }) {
  return (
    <div
      className="
        relative mx-auto w-44 h-44 rounded-xl
        bg-white p-3 shadow-lg
      "
    >
      <Image
        src={src}
        alt="Donation QR"
        fill
        className="object-contain rounded-lg"
      />
    </div>
  );
}

function FooterText() {
  return (
    <p className="mt-6 text-sm italic text-[#4B1E00]/70">
      Scan & offer your contribution
    </p>
  );
}
