'use client';

import { motion } from 'framer-motion';

export default function DownloadsPage() {
  const items = [
    {
      title: "Ekta Directory – Gents (2025)",
      subtitle: "View & Download PDF",
      icon: "📄",
      href: "/directory/Ekta_Directory_Gents_2025.pdf",
      img: "/directory/ekta-gents.jpeg",
    },
    {
      title: "Ekta Directory – Ladies (2025)",
      subtitle: "View & Download PDF",
      icon: "📄",
      href: "/directory/Ekta_Directory_Ladies_2025.pdf",
      img: "/directory/ekta-ladies.jpeg",
    },
    {
      title: "Pulak Awards (2025)",
      subtitle: "Award Ceremony List",
      icon: "🏆",
      href: "/directory/Pulak_Award-2025.pdf",
      img: "/directory/pulak-awards.png",
    },
    {
      title: "Manch Masiki (2025)",
      subtitle: "Monthly Magazine",
      icon: "📰",
      href: "/directory/Manch_Masiki-2025.pdf",
      img: "/directory/manch-masiki.jpeg",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF9EF] via-[#FFF3D8] to-[#FBEBD2] px-6 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/swastik-pattern.png')] opacity-5 bg-cover bg-center pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-[#6A0000]">
            Downloads & Resources
          </h1>

          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4 rounded-full" />

          <p className="mt-5 text-[#6B3F00] text-lg max-w-2xl mx-auto">
            Access official directories, award listings, publications, and downloadable resources from Jinsharnam Media.
          </p>
        </motion.div>

        {/* DOWNLOAD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
          {items.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl border border-[#E7D6BF] bg-white/90 backdrop-blur-md shadow-[0_20px_40px_rgba(106,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(106,0,0,0.18)] hover:-translate-y-3 transition-all duration-500"
            >
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD98A]/10 via-transparent to-[#C45A00]/10 opacity-0 group-hover:opacity-100 transition duration-500" />

              {/* IMAGE */}
              <div className="p-5 bg-[#FFF8EE]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[280px] object-contain rounded-2xl transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 text-center relative z-10">
                <div className="text-4xl mb-3">{item.icon}</div>

                <h3 className="font-serif text-xl text-[#6A0000] leading-snug min-h-[60px]">
                  {item.title}
                </h3>

                <p className="text-sm text-[#8B5A2B] mt-2">
                  {item.subtitle}
                </p>

                <div className="mt-5 inline-block rounded-full bg-gradient-to-r from-[#6A0000] to-[#8B0000] px-5 py-2 text-sm font-semibold text-white shadow-md group-hover:scale-105 transition">
                  Download Now →
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}