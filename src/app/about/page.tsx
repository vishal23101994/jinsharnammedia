'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Heart, Sparkles, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EF] via-[#FFE8B2] to-[#FFD580] text-[#3A0A00] py-24">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/swastik-pattern.png')] opacity-10 bg-cover bg-center"></div>

      {/* 🌺 Header */}
      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-serif text-[#8B0000] mb-6 drop-shadow-lg">
          About <span className="text-[#C45A00]">Jinsharnam Media</span>
        </h1>
        <p className="text-lg md:text-m max-w-3xl mx-auto text-[#4B2200] leading-relaxed">
          <strong>Jinsharnam Media</strong> is dedicated to spreading the timeless wisdom of Jain philosophy 
          through <em>compassion</em>, <em>peace</em>, and <strong>technology-driven communication</strong>. 
          We connect spirituality with modern storytelling — inspiring transformation through creative media.
        </p>
      </motion.div>

      {/* 🌿 Acharya Inspiration */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center mt-32 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/images/7.jpg"
          alt="Acharya Pulak Sagar Ji"
          width={240}
          height={240}
          className="rounded-full border-4 border-[#C45A00] shadow-2xl object-cover mb-6"
        />
        <h3 className="text-2xl md:text-3xl text-[#8B0000] font-serif font-semibold">
          Acharya Pulak Sagar Ji Maharaj
        </h3>
        <p className="max-w-2xl mx-auto mt-3 text-[#4B2200] text-lg leading-relaxed">
          The spiritual force behind Jinsharnam Media, Acharya Pulak Sagar Ji inspires our journey 
          with teachings rooted in purity, mindfulness, and service to humanity.
        </p>
      </motion.div>

      {/* 👥 Founders Section */}
      <div className="relative max-w-7xl mx-auto mt-32 px-6 text-center z-10">
        <div className="flex justify-center mb-8">
          <Users className="w-14 h-14 text-[#C45A00] animate-pulse" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-[#8B0000] mb-4">
          Our Founders
        </h2>
        <p className="text-lg text-[#4B2200] max-w-3xl mx-auto mb-16 leading-relaxed">
          <strong>Ankit Jain 'Prince'</strong> and <strong>Seema Jain</strong> are visionaries who blend 
          leadership, innovation, and Jain philosophy to shape Jinsharnam Media’s mission of 
          creative excellence and spiritual growth.
        </p>

        {/* Founder Profiles */}
        <div className="space-y-24">
          {/* Ankit Jain */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-10"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/founder/ankit.jpeg"
              alt="Ankit Jain"
              width={250}
              height={250}
              className="rounded-full border-[6px] border-[#C45A00] shadow-[0_10px_40px_-10px_rgba(196,90,0,0.6)] object-cover"
            />
            <div className="md:w-2/3 bg-gradient-to-b from-[#FFE8B2] to-[#FFD580] p-8 rounded-3xl border border-[#ECA400]/30 text-left shadow-md">
              <h3 className="text-2xl font-serif text-[#8B0000] font-semibold mb-2">
                Ankit Jain 'Prince'
              </h3>
              <p className="text-sm uppercase tracking-wide text-[#C45A00] mb-4">
                Founder & Managing Director
              </p>
              <p className="text-[#3A0A00] leading-relaxed text-justify">
                <strong>Ankit Jain</strong> is a visionary entrepreneur and media innovator with over 
                <strong> 20 years</strong> of experience in the <strong>graphics and media industries. </strong> 
                As the <strong>Founder and Managing Director</strong> of <em>Pulak Graphics</em> and <em>Jinsharnam Media</em>, 
                he has dedicated his career to harmonizing <strong>creativity, technology, and spirituality.</strong>
              </p>
              <p className="text-[#3A0A00] leading-relaxed text-justify">
                Under his leadership, <strong>Pulak Graphics</strong> has evolved into a trusted name in 
                <strong> print and design solutions</strong>. With <strong>Jinsharnam Media</strong>, he extended 
                his vision into digital platforms, producing inspirational and spiritual content that resonates globally.
              </p>
              <p className="text-[#3A0A00] leading-relaxed text-justify">
                A firm believer in <strong>social responsibility</strong>, he actively supports 
                <strong> community trusts and philanthropic initiatives</strong>, using media as a 
                medium for <strong>positive change</strong>.
              </p>
              <p className="text-[#3A0A00] leading-relaxed text-justify">
                Guided by faith and innovation, Ankit Jain continues to inspire a balance between 
                <strong> entrepreneurship, spirituality, and community service.</strong>
              </p>
            </div>
          </motion.div>

          {/* Seema Jain */}
          <motion.div
            className="flex flex-col md:flex-row-reverse items-center justify-between gap-10"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/founder/seema.jpeg"
              alt="Seema Jain"
              width={250}
              height={250}
              className="rounded-full border-[6px] border-[#C45A00] shadow-[0_10px_40px_-10px_rgba(196,90,0,0.6)] object-cover"
            />
            <div className="md:w-2/3 bg-gradient-to-b from-[#FFE8B2] to-[#FFD580] p-8 rounded-3xl border border-[#ECA400]/30 text-left shadow-md">
              <h3 className="text-2xl font-serif text-[#8B0000] font-semibold mb-2">
                Seema Jain
              </h3>
              <p className="text-sm uppercase tracking-wide text-[#C45A00] mb-4">
                Founder & Director
              </p>
              <p className="text-[#3A0A00] leading-relaxed text-justify">
                <strong>Seema Jain</strong> is an accomplished entrepreneur and visionary leader with 
                extensive experience in <strong>media, telecommunications,</strong> and 
                <strong> business process management.</strong> As the <strong>Founder & CEO of Echoe Assistance Pvt. Ltd. </strong> 
                and <strong>Director of Jinsharnam Media</strong>, she blends <em>strategy, innovation,</em> and <em>compassion</em>.
              </p>
              <p className="text-[#3A0A00] leading-relaxed text-justify">
                With a strong background in managing <strong>global healthcare and BPM operations</strong>, 
                she brings organizational excellence with a human touch. At <strong>Jinsharnam Media</strong>, 
                she leads creative and spiritual storytelling inspired by 
                <em> Acharya Shri Pulak Sagar Ji Maharaj</em>.
              </p>
              <p className="text-[#3A0A00] leading-relaxed text-justify">
                Her leadership reflects Jain principles of <em>truth, mindfulness,</em> and <em>compassion</em>. 
                She believes in empowering individuals, fostering innovation, and creating media that uplifts humanity.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 🏢 Company Overview */}
      <motion.div
        className="relative max-w-7xl mx-auto mt-20 px-10 py-16 rounded-3xl bg-gradient-to-br from-[#FFF8E1] to-[#FFE8A0] border border-[#FFD700]/40 shadow-[0_20px_60px_-15px_rgba(196,90,0,0.3)] overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="md:w-1/2 space-y-5 text-justify">
            <h2 className="text-4xl font-serif font-bold text-[#8B0000] mb-4">
              About the Company
            </h2>
            <p className="text-lg leading-relaxed text-[#3A0A00]">
              <strong>Jinsharnam Media Pvt. Ltd.</strong> is a spiritual and creative media enterprise 
              uniting communities through digital, print, and social platforms. Our philosophy draws inspiration 
              from the core Jain values of <em>truth, non-violence, and mindfulness</em>.
            </p>
            <p className="text-lg leading-relaxed text-[#3A0A00]">
              We offer a full spectrum of <strong>360° media services</strong> — including live broadcasts 
              of Jain Saints, event management, branding, and IT-enabled storytelling — integrating art, devotion, 
              and innovation.
            </p>
            <p className="text-lg leading-relaxed text-[#3A0A00]">
              Our mission is to empower spiritual, social, and corporate voices through 
              <strong> compassion, creativity,</strong> and <strong>technology</strong>, 
              creating meaningful content that inspires transformation and harmony.
            </p>
          </div>

          {/* Image */}
          <motion.div
            className="md:w-1/2 relative flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD580]/40 to-transparent rounded-3xl blur-3xl"></div>
            <Image
              src="/images/our services/9.png"
              alt="Jinsharnam Media Overview"
              width={520}
              height={380}
              className="rounded-3xl shadow-2xl border-4 border-[#C45A00]/40 object-cover relative z-10"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 🧡 Core Values */}
      <div className="max-w-7xl mx-auto mt-28 grid md:grid-cols-3 gap-10 px-6 relative z-10">
        {[
          {
            icon: <Heart className="w-12 h-12 text-[#C45A00]" />,
            title: 'Compassion',
            text: 'We create with empathy and purpose, ensuring that every project promotes peace, harmony, and understanding.',
          },
          {
            icon: <Sparkles className="w-12 h-12 text-[#C45A00]" />,
            title: 'Creativity',
            text: 'We combine innovation and artistry to transform traditional teachings into engaging modern experiences.',
          },
          {
            icon: <Target className="w-12 h-12 text-[#C45A00]" />,
            title: 'Commitment',
            text: 'We dedicate ourselves to quality, authenticity, and ethical storytelling aligned with Jain dharma.',
          },
        ].map((value, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            className="p-8 bg-gradient-to-br from-[#FFFDF5] to-[#FFF1C8] rounded-3xl border border-[#ECA400]/30 shadow-[0_10px_30px_-10px_rgba(196,90,0,0.25)] text-center hover:shadow-2xl hover:scale-[1.03] transition-transform"
          >
            <div className="flex justify-center mb-4">{value.icon}</div>
            <h3 className="text-2xl font-serif text-[#8B0000] mb-3">{value.title}</h3>
            <p className="text-[#3A0A00] text-justify">{value.text}</p>
          </motion.div>
        ))}
      </div>

      {/* ✨ CTA */}
      <motion.div
        className="text-center mt-24 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl text-[#A43B00] mb-3 font-serif font-bold">
          Join Our Journey
        </h2>
        <p className="max-w-3xl mx-auto text-[#3A0A00] mb-6 leading-relaxed">
          Be part of a growing spiritual community walking the path of truth and peace. 
          Support our mission to share the timeless values of Jainism through media that inspires, educates, and uplifts.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            href="/media/videos"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#3A0A00] font-semibold rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            Watch Our Work →
          </Link>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#C45A00] to-[#ECA400] text-white font-semibold rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            Connect With Us
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
