"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function SuccessContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "Member";
  const email = searchParams.get("email") || "-";
  const phone = searchParams.get("phone") || "-";

  useEffect(() => {
    // Initial Blast
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
    });

    // Side Fireworks
    setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 120,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
      });
    }, 500);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF3C4] via-[#FFF8E7] to-[#FFE7B3] p-6">

      {/* Floating Background Glow */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-amber-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-2xl p-12 max-w-xl w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Image
            src="/images/logo/pulakmanch.png"
            alt="Pulak Manch Logo"
            width={110}
            height={110}
          />
        </motion.div>

        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-ping" />
            <CheckCircle size={80} className="text-green-600 relative z-10" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-serif text-[#6A0000] mb-4"
        >
          🎉 Congratulations {name}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-[#4B1E00] mb-8"
        >
          Your registration has been successfully completed.
          <br />
          Welcome to the Pulak Manch Parivar!
        </motion.p>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl text-left space-y-4 shadow-inner border border-amber-200"
        >
          <div className="flex items-center gap-3">
            <Mail className="text-[#6A0000]" />
            <span className="font-medium">{email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-[#6A0000]" />
            <span className="font-medium">{phone}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}