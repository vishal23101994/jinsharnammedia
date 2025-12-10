"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrganizationPage() {
  return (
    <section className="min-h-screen py-24 bg-gradient-to-br from-[#FFF8E7] via-[#FAE3A3]/40 to-[#FFF8E7] text-center px-6">
      <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="font-serif text-5xl text-[#4B1E00] mb-12">
        Our Organization
      </motion.h1>
      <p className="max-w-3xl mx-auto text-lg text-[#4B1E00]/90 mb-12">
        Jinsharnam Media works through two main arms that focus on spiritual growth and social awareness: 
        Jinsharnam Tirth and Pulakmunch.
      </p>
      <div className="flex justify-center gap-10">
        <Link href="/organization/jinsharnam-tirth" className="bg-[#FFD97A]/80 px-6 py-3 rounded-full font-semibold text-[#4B1E00] hover:bg-[#FFD97A] transition">
          Jinsharnam Tirth
        </Link>
        <Link href="/organization/vatsalya-dhara" className="bg-[#FFD97A]/80 px-6 py-3 rounded-full font-semibold text-[#4B1E00] hover:bg-[#FFD97A] transition">
          Vatsalya Dhara
        </Link>
      </div>
    </section>
  );
}
