"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsAppButton() {
  const phoneNumber = "919810900699"; // 🔁 replace with real number
  const message = encodeURIComponent(
    "Jai Jinendra 🙏 I would like to know more about your services."
  );

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="
        fixed
        bottom-5 left-6
        z-[9999]
        w-14 h-14
        rounded-full
        bg-white
        shadow-2xl
        flex items-center justify-center
      "
    >
      <Image
        src="/icons/whatsapp.png"
        alt="WhatsApp"
        width={54}
        height={54}
        priority
      />
    </motion.a>
  );
}
