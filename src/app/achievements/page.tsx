"use client";
import { motion } from "framer-motion";

export default function AchievementsPage() {
  const achievements = [
    "Successfully launched Jinsharnam Media YouTube channel reaching 100k+ followers.",
    "Digitized ancient Jain manuscripts for global accessibility.",
    "Organized 200+ community spiritual events worldwide.",
  ];

  return (
    <section className="min-h-screen py-24 bg-gradient-to-b from-[#FAE3A3]/40 to-[#FFF8E7] text-center px-6">
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="font-serif text-5xl text-[#4B1E00] mb-12">
        Our Achievements
      </motion.h1>
      <ul className="max-w-3xl mx-auto space-y-6 text-left text-lg text-[#4B1E00]/90">
        {achievements.map((a, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-[#FFF8E7]/60 border border-[#FFD97A]/40 rounded-xl p-6 shadow-sm"
          >
            🌟 {a}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
