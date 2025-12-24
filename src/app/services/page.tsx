"use client";

import { motion } from "framer-motion";
import {
  Radio,
  Megaphone,
  Camera,
  Globe2,
  Users,
  FileText,
  Tv,
  Network,
  Heart,
  Sparkles,
  Star,
  Handshake,
  Zap,
} from "lucide-react";
import CountUp from "react-countup";

export default function ServicesPage() {
  const stats = [
    { label: "Live Broadcasts", value: 500, icon: <Tv className="w-8 h-8 text-[#C45A00]" /> },
    { label: "Events Managed", value: 120, icon: <Camera className="w-8 h-8 text-[#C45A00]" /> },
    { label: "Global Viewers", value: 1000000, icon: <Globe2 className="w-8 h-8 text-[#C45A00]" /> },
    { label: "Organizational Partners", value: 50, icon: <Handshake className="w-8 h-8 text-[#C45A00]" /> },
  ];

  // 🪷 Services Section with Real Images
  const services = [
    {
      image: "/images/our services/7.JPG",
      title: "Spiritual Live Broadcasting",
      desc: "Delivering sacred discourses and live Pravachans from Jain saints worldwide through professional HD streaming.",
    },
    {
      image: "/images/our services/2.png",
      title: "Brand Awareness & Advertising",
      desc: "Creating impactful media campaigns for organizations, temples, and events to connect with millions.",
    },
    {
      image: "/images/our services/3.jpeg",
      title: "Event Production & Coverage",
      desc: "End-to-end event coverage with cinematic visuals, live telecast setup, and aerial videography.",
    },
    {
      image: "/images/our services/5.jpg",
      title: "IT & Media Solutions",
      desc: "Offering website design, mobile apps, and digital management tools to empower modern Jain institutions.",
    },
  ];

  const printSubTypes = [
    {
      title: "Jain Magazines & Periodicals",
      desc: "Monthly, quarterly, and special-edition magazines covering Jain philosophy, pravachans, Chaturmas updates, and spiritual thought.",
      icon: <FileText className="w-8 h-8 text-white" />,
      gradient: "from-[#8B0000] to-[#C45A00]",
    },
    {
      title: "Religious Books & Granth Publications",
      desc: "Editing, layout, printing, and publishing of Jain scriptures, pravachan compilations, and biographies of saints.",
      icon: <Star className="w-8 h-8 text-white" />,
      gradient: "from-[#6B0F1A] to-[#B91372]",
    },
    {
      title: "Chaturmas & Event Special Editions",
      desc: "Souvenir books, event documentation volumes, and commemorative publications for major Jain events.",
      icon: <Sparkles className="w-8 h-8 text-white" />,
      gradient: "from-[#7A1CAC] to-[#C77DFF]",
    },
    {
      title: "Calendars, Diaries & Annual Publications",
      desc: "Spiritually themed Jain calendars, Panchang-based diaries, and annual reference publications.",
      icon: <Heart className="w-8 h-8 text-white" />,
      gradient: "from-[#A43B00] to-[#FF9F1C]",
    },
    {
      title: "Posters, Hoardings & Press Material",
      desc: "High-quality posters, banners, hoardings, invitations, and press-ready creatives with Jain aesthetics.",
      icon: <Megaphone className="w-8 h-8 text-white" />,
      gradient: "from-[#003566] to-[#1D4ED8]",
    },
    {
      title: "Editorial & Content Curation",
      desc: "Content planning, proofreading, spiritual editorial guidance, and publication workflow management.",
      icon: <Users className="w-8 h-8 text-white" />,
      gradient: "from-[#065F46] to-[#16A34A]",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#FFF4E0] via-[#FFE0A8] to-[#FFD580] text-[#3A0A00] overflow-hidden">
      {/* 🌟 Floating Jain Symbol Background */}
      <div className="absolute inset-0 opacity-10 bg-[url('/swastik-pattern.png')] bg-cover bg-center"></div>

      {/* 🌅 Hero Section */}
      <motion.div
        className="relative text-center py-28 px-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Sparkles className="w-12 h-12 mx-auto text-[#C45A00]" />
        <h1 className="text-5xl md:text-6xl font-serif text-[#8B0000] mb-6">
          <span className="text-[#C45A00]">Jinsharnam Media</span> Services
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-[#4B2200] leading-relaxed">
          Merging spirituality, innovation, and technology — we spread Jain wisdom across the globe through transformative media experiences.
        </p>
      </motion.div>

      {/* 🔥 Impact Counters */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center pb-20 px-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white/70 rounded-3xl shadow-xl border border-[#ECA400]/40 hover:scale-105 transition-all"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="flex justify-center mb-2">{s.icon}</div>
            <h3 className="text-3xl font-bold text-[#8B0000]">
              <CountUp end={s.value} duration={2} separator="," />+
            </h3>
            <p className="text-sm text-[#4B2200] mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 🕉️ Services Grid */}
      <div className="max-w-7xl mx-auto px-5 pb-20">
        <motion.h2
          className="text-4xl text-center font-serif text-[#A43B00] mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#A43B00] font-semibold mb-4">
            Our <span className="text-[#C45A00]">Services</span>
          </h2>
        </motion.h2>

        {/* 📚 Featured Print & Publication Section */}
        <motion.div
          className="relative max-w-8xl mx-auto px-6 pb-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#FFF1D6] via-[#FFE2A8] to-[#FFD27A] shadow-2xl border-2 border-[#ECA400]/60">

            {/* Glow Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#FFD97A]/30 via-transparent to-[#FFD97A]/30"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center p-12">

              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-10 h-10 text-[#C45A00]" />
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#8B0000]">
                    Print & Publications
                  </h2>
                </div>
                <p className="text-lg text-[#4B2200] leading-relaxed mb-6 text-justify">
                  <b>Print & Publications is the foundation of Jinsharnam Media.</b><br />
                  We function as a dedicated Jain spiritual publication house, managing
                  everything from content planning and editorial design to large-scale
                  printing and nationwide distribution.
                </p>
              </div>
              {/* Image Stack */}
              <div className="relative">
                <motion.img
                  src="/images/our services/4.png"
                  alt="Jain Print Publications"
                  className="rounded-3xl shadow-xl border border-[#ECA400]/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />

                <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-[#ECA400]/40">
                  <p className="text-sm font-semibold text-[#8B0000]">
                    Trusted by Jain Institutions Nationwide
                  </p>
                </div>
              </div>
            </div>
            {/* 📦 Print & Publication Subtype Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {printSubTypes.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className={`relative rounded-3xl p-6 text-white shadow-xl overflow-hidden bg-gradient-to-br ${item.gradient}`}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>

                  {/* Icon */}
                  <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg">
                    {item.icon}
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/90">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="group relative rounded-3xl overflow-hidden shadow-lg border border-[#ECA400]/40 hover:scale-105 hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Service Image */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A0A00]/70 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Text Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#8B0000] mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-[#3A0A00] leading-relaxed">
                  {service.desc}
                </p>
              </div>

              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#FFD97A]/10 to-[#FFF8E7]/10"></div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* 💎 Why Jinsharnam Media */}
      <div className="relative py-24 bg-gradient-to-b from-[#FFF8E7] via-[#FFEEC2] to-[#FFD97A] border-t border-amber-300 overflow-hidden">
        <motion.div
          className="text-center relative z-10 mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#A43B00] font-semibold mb-4">
            Why Choose <span className="text-[#C45A00]">Jinsharnam Media?</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-[#4B2200] leading-relaxed">
            We combine <b>spiritual devotion</b>, <b>creative vision</b>, and <b>modern technology</b> to spread Jain values through every medium — from live Pravachans to global media campaigns.
          </p>
        </motion.div>

        {/* 🌿 Feature Cards with Images */}
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 relative z-10">
          {[
            {
              image: "/images/our services/img13.jpeg",
              title: "Dedicated Spiritual Media Experts",
              desc: "A passionate team blending creativity, devotion, and innovation to serve spiritual causes with professional excellence.",
            },
            {
              image: "/images/our services/1.jpg",
              title: "Pan-India & Global Broadcast Reach",
              desc: "Connecting Jain spiritual events to audiences across India and worldwide through advanced HD streaming technology.",
            },
            {
              image: "/images/our services/img14.jpeg",
              title: "Professional Studio & Production Units",
              desc: "High-end video, audio, and digital production infrastructure ensuring top-quality event coverage and content creation.",
            },
            {
              image: "/images/our services/img16.jpeg",
              title: "Deep Understanding of Jain Values",
              desc: "Rooted in Jain philosophy, every project reflects compassion, peace, and the eternal truth of Ahimsa.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="group relative rounded-3xl overflow-hidden shadow-lg border border-[#ECA400]/40 hover:scale-105 hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Image */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A0A00]/70 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#8B0000] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#3A0A00] leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              {/* Subtle Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#FFD97A]/10 to-[#FFF8E7]/10"></div>
            </motion.div>
          ))}
        </div>

        {/* 🌿 Acharya Pulak Sagar Ji Section */}
        <div className="max-w-6xl mx-auto mt-24 flex flex-col md:flex-row items-center justify-center gap-12 px-6 relative z-10">
          <motion.img
            src="/images/gallery/maharaj/7.jpg"
            alt="Acharya Shri Pulak Sagar Ji Maharaj"
            className="w-72 h-72 object-cover rounded-full shadow-2xl border-4 border-[#ECA400]/60 hover:scale-105 transition-transform"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />

          <motion.div
            className="max-w-xl text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-serif text-[#8B0000] mb-3">
              “A Vision Blessed by Acharya Shri Pulak Sagar Ji”
            </h3>
            <p className="text-[#4B2200] leading-relaxed text-lg italic">
              “Through Jinsharnam Media, may the eternal message of Jainism — of peace, compassion,
              and self-realization — reach every household across the world.”
            </p>
            <p className="mt-3 text-[#A43B00] font-semibold">
              — Acharya Shri Pulak Sagar Ji Maharaj
            </p>
          </motion.div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFE8B3]/30 to-transparent blur-3xl"></div>
      </div>

      {/* 🚀 CTA Section */}
      <div className="text-center py-20 bg-gradient-to-r from-[#FFD580] to-[#FFEAB8]">
        <h2 className="text-3xl font-serif text-[#A43B00] mb-3 font-semibold">
          Let’s Create a Spiritual Digital Revolution
        </h2>
        <p className="max-w-2xl mx-auto text-[#3A0A00] mb-6">
          Collaborate with Jinsharnam Media to share the eternal light of Jain wisdom
          through media, technology, and innovation.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#3A0A00] font-semibold rounded-full shadow-md hover:scale-105 transition-transform"
        >
          Connect With Us →
        </a>
      </div>
    </section>
  );
}
