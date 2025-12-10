"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  width: number;
  height: number;
  top: string;
  left: string;
}

export default function FloatingParticles({ count = 25 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles only on client after hydration
  useEffect(() => {
    const generated = Array.from({ length: count }).map(() => ({
      width: Math.random() * 10 + 4,
      height: Math.random() * 10 + 4,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setParticles(generated);
  }, [count]);

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#FFD97A] opacity-30 blur-md"
          style={p}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 6 + 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
