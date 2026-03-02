"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

export default function PendingPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF3C4] via-[#FFF8E7] to-[#FFE7B3] px-6">

      {/* Floating Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-xl w-full bg-white/70 backdrop-blur-2xl border border-amber-200 rounded-3xl shadow-2xl p-12 text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl">
            <Clock size={36} />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-serif text-[#6A0000] mb-4">
          Registration Under Review
        </h1>

        <div className="w-24 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto mb-6" />

        {/* Description */}
        <p className="text-[#4B1E00] text-lg leading-relaxed mb-6">
          Thank you for becoming a part of our spiritual journey.
          <br />
          Your registration has been received successfully.
        </p>

        {/* Highlight Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-6 mb-8 shadow-inner"
        >
          <div className="flex items-center justify-center gap-3 text-[#6A0000] font-semibold text-lg">
            <ShieldCheck size={22} />
            Approval usually takes 12–24 hours
          </div>

          <div className="mt-3 flex justify-center items-center gap-2 text-amber-600 text-sm">
            <Sparkles size={16} />
            You will be notified once approved
          </div>
        </motion.div>

        {/* Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/"
            className="inline-block px-10 py-4 rounded-full text-white font-semibold
            bg-gradient-to-r from-[#6A0000] via-[#8B0000] to-[#A00000]
            shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Back to Home
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
}