"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingParticles from "@/components/FloatingParticles";
import AdvertisementCards from "@/components/AdvertisementCards";
import LatestUpdatesSection from "@/components/LatestUpdatesSection";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import FeedbackSection from "@/components/FeedbackSection";



// 🎥 YouTube video type
type Video = { id: string; title: string; thumbnail?: string; publishedAt?: string };

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/youtube/home");
        const data = await res.json();
        const list = data.latestVideos || [];

        const vids = list.slice(0, 4).map((v: any) => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail || "/images/default-thumb.jpg",
        }));

        setVideos(vids);
      } catch (err) {
        console.error("Error fetching YouTube videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <LatestUpdatesSection />
      <UpcomingEventsSection />
      <AdvertisementCards />
      <PulakSagarHighlights />
      <LatestVideosSection videos={videos} loading={loading} />
      <FeedbackSection />
    </>
  );
}


/* --------------------------------------------------
 🪷 HERO SECTION
-------------------------------------------------- */
function HeroSection() {
  return (
    <section className="relative overflow-hidden h-screen flex items-center justify-center bg-gradient-to-br from-[#4B1E00] via-[#B97A2B] to-[#FAE3A3] text-white">
      <div className="absolute inset-0 bg-gradient-to-t from-[#4B1E00]/70 via-transparent to-[#FFD97A]/10" />

      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#FFD97A] opacity-30 blur-md"
          style={{
            width: Math.random() * 8 + 3,
            height: Math.random() * 8 + 3,
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 6 + 5,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="relative z-10 grid md:grid-cols-2 items-center max-w-7xl mx-auto px-6 gap-12">
        <div className="relative flex justify-center items-center">
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 400"
              className="w-[580px] h-[580px] opacity-50 text-[#FFD97A]"
            >
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x = 200 + 160 * Math.cos(angle);
                const y = 200 + 160 * Math.sin(angle);
                return (
                  <motion.text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="40"
                    fill="currentColor"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      delay: i * 0.5,
                    }}
                  >
                    卐
                  </motion.text>
                );
              })}
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative rounded-full border-[10px] border-[#FFD97A] p-2 shadow-[0_0_50px_rgba(255,217,122,0.6)] bg-gradient-to-br from-[#FFF8E7] via-[#FFE28A]/40 to-[#FFD97A]/10"
          >
            <Image
              src="/images/b1.jpeg"
              alt="Acharya Pulak Sagar Ji"
              width={360}
              height={360}
              className="rounded-full object-cover"
              priority
            />
          </motion.div>
        </div>

        <div className="text-center md:text-left space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-6xl text-[#FFF8E7]"
          >
            Rashtrasant Manogyacharya<br/>Shree Pulak Sagar Ji Gurudev
          </motion.h1>
          <p className="text-lg md:text-xl text-[#FFF8E7]/90 max-w-lg">
            A revered Jain monk and spiritual teacher, guiding souls towards{" "}
            <span className="text-[#FFD97A] font-semibold">Ahimsa</span>,{" "}
            <span className="text-[#FFD97A] font-semibold">Satya</span>, and{" "}
            <span className="text-[#FFD97A] font-semibold">Aparigraha</span>.
          </p>
          <Link
            href="/pulak-sagar"
            className="inline-block rounded-full bg-[#FFD97A] text-[#4B1E00] px-8 py-3 font-semibold hover:bg-[#FFE28A] transition-all duration-300 shadow-md"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------
 🌿 MESSAGE SECTION
-------------------------------------------------- */
function AboutSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#FAE3A3]/40 via-[#FFF8E7] to-[#FAE3A3]/20 text-center px-6 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#FFD97A] opacity-30 blur-md"
          style={{
            width: Math.random() * 6 + 4,
            height: Math.random() * 6 + 4,
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 5 + 4,
            delay: i * 0.2,
          }}
        />
      ))}

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative font-serif text-4xl md:text-4xl text-[#4B1E00] mb-14 italic"
      >
        A Message from Pulak Sagar Ji
      </motion.h2>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(185,122,43,0.5)] border-[6px] border-[#FFD97A] bg-gradient-to-br from-[#FFF8E7]/70 to-[#FFD97A]/30 p-2">
            <Image
              src="/images/b2.jpg"
              alt="A Message from Pulak Sagar Ji"
              width={500}
              height={500}
              className="rounded-2xl object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative bg-gradient-to-br from-[#FFF8E7]/80 to-[#FAE3A3]/40 rounded-3xl border-[4px] border-[#FFD97A] shadow-[0_0_50px_rgba(255,217,122,0.4)] p-10 text-left"
        >
          <p className="text-[#4B1E00] text-md md:text-xl leading-relaxed italic">
            “In this age of distractions and desires, peace is not found outside
            but within. Let your thoughts be pure, your speech truthful, and
            your actions compassionate — for these are the pillars of a
            spiritual life.”
          </p>
          <p className="text-[#B97A2B] font-semibold mt-6 text-right text-lg italic">
            – Acharya Shri Pulak Sagar Ji
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------
 🌟 Pulak Sagar Highlights Section
-------------------------------------------------- */
function PulakSagarHighlights() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#FFF8E7] via-[#FFEEC2] to-[#FFD97A]/20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-serif text-[#4B1E00] mb-14"
        >
          Glimpse of Acharya Ji’s Life
        </motion.h2>

        {/* BIOGRAPHY SNAPSHOT */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <Image
            src="/images/b4.jpg"
            alt="Acharya Ji Childhood"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg border border-[#FFD97A]/60"
          />
          <div className="text-[#4B1E00]/90 text-lg leading-relaxed">
            <p>
              A divine soul was born on <strong>11 May 1970</strong> in
              Dhamtari, Chhattisgarh, named <strong>Singhai Paras Jain (Guddu)</strong>.
              Guided by spiritual curiosity from a young age, he dedicated his
              life to spreading Jain values of compassion, meditation, and peace.
            </p>
            <Link
              href="/pulak-sagar"
              className="inline-block mt-5 bg-[#FFD97A] text-[#4B1E00] px-6 py-2 rounded-full font-semibold hover:bg-[#FFE28A] transition"
            >
              Read Full Biography →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------
 🎥 LATEST VIDEOS SECTION — Inline YouTube Player
-------------------------------------------------- */
function LatestVideosSection({
  videos,
  loading,
}: {
  videos?: Video[];
  loading?: boolean;
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="py-24 text-center bg-gradient-to-b from-[#FFEEC2] to-[#FFF8E7]">
        <h2 className="text-3xl text-[#8B0000] font-serif">Loading latest videos…</h2>
      </section>
    );
  }

  return (
    <section className="relative py-28 bg-gradient-to-b from-[#FAE3A3]/40 via-[#FFF8E7] to-[#FAE3A3]/20 text-center">
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-serif text-[#4B1E00] mb-14"
        >
          Latest Videos from Jinsharnam Media
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {videos?.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ scale: 1.03 }}
              className="group rounded-2xl overflow-hidden border border-[#FFD97A]/60 bg-gradient-to-br from-[#FFF8E7]/80 to-[#FFE28A]/30 shadow-[0_10px_25px_rgba(255,217,122,0.3)] relative"
            >
              {activeVideo === video.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[220px] rounded-2xl"
                />
              ) : (
                <div
                  className="relative cursor-pointer"
                  onClick={() => setActiveVideo(video.id)}
                >
                  <Image
                    src={video.thumbnail!}
                    alt={video.title}
                    width={320}
                    height={200}
                    className="w-full h-[220px] object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                    <div className="w-14 h-14 bg-[#FF0000] rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-l-[14px] border-t-[9px] border-b-[9px] border-l-white border-t-transparent border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4 text-left">
                <p className="font-medium text-[#4B1E00] line-clamp-2 group-hover:text-[#8B0000] transition">
                  {video.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          href="/media/videos"
          className="inline-block mt-12 bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-[0_0_30px_rgba(255,217,122,0.5)] hover:scale-105 transition-all"
        >
          View All Videos →
        </Link>
      </div>
    </section>
  );
}


