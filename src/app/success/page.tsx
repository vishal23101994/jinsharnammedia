"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Mail, Phone } from "lucide-react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  /* 🎉 CONFETTI + FIREWORKS */
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ["#6A0000", "#D4AF37", "#FFD700", "#FF9933"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors,
      });

      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Firework burst in center
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors,
      });
    }, 800);

  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF3C4] via-[#FFF8E7] to-[#FFE7B3] px-6 py-20 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-center"
      >

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo/pulakmanch.png"
            alt="Pulak Manch Logo"
            width={100}
            height={100}
          />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle size={75} className="text-green-600 animate-bounce" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-serif text-[#6A0000] mb-3">
          Thank You, {name} 🙏
        </h1>

        <p className="text-[#4B1E00] text-lg mb-8">
          Your registration has been successfully completed.
          Welcome to the Pulak Manch Parivar!
        </p>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto mb-8" />

        {/* User Details */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left space-y-4">

          <h2 className="text-xl font-semibold text-[#6A0000] text-center mb-4">
            Registration Details
          </h2>

          <div className="flex items-center gap-3">
            <Mail className="text-[#6A0000]" size={18} />
            <span className="text-[#4B1E00]">{email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-[#6A0000]" size={18} />
            <span className="text-[#4B1E00]">{phone}</span>
          </div>
        </div>

      </motion.div>
    </section>
  );
}