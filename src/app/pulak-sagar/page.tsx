'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Landmark,
  MapPin,
  Medal,
  Quote,
  Rss,
  Shield,
  Swords,
  User,
  Users,
} from 'lucide-react';

export default function PulakSagarPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EF] via-[#FFE8B2] to-[#FFD580] text-[#3A0A00]">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/swastik-pattern.png')] opacity-10 bg-cover bg-center pointer-events-none" />

      {/* HERO (kept photo at top as requested) */}
      <header className="relative max-w-7xl mx-auto px-6 pt-20 pb-12 z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-[#8B0000] leading-tight">
              Rashtrasant Manogyacharya <br/> Shree Pulak Sagar Ji Gurudev
            </h1>

            <p className="mt-4 text-lg md:text-xl text-justify">
              Pulak Sagar Ji is a revered <strong>Digambara Jain Sant</strong>. Gurudev’s inspiring
              <em> pravachans</em> are available on our YouTube channel
              <span className="font-semibold"> — Jinsharnam Media</span>.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/media/videos"
                className="inline-block rounded-full bg-[#FBBF24] px-6 py-2 font-semibold text-[#3A0A00] shadow hover:scale-[1.02] transition"
              >
                Watch Pravachans →
              </Link>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-[#C45A00] px-6 py-2 font-semibold text-white shadow hover:scale-[1.02] transition"
              >
                Invite for Discourse
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD580]/40 to-transparent rounded-3xl blur-3xl"></div>
            <Image
              src="/images/b7.jpg"
              alt="Acharyashri Pulak Sagar Ji"
              width={560}
              height={420}
              priority
              className="relative z-10 rounded-3xl border-4 border-[#C45A00]/40 shadow-2xl object-cover"
            />
          </motion.div>
        </div>
      </header>

      {/* 🌟 BIOGRAPHY */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#FFF8E1] via-[#FFEFB3] to-[#FFE08A] border border-[#FFD700]/50 p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(196,90,0,0.3)]"
        >
          {/* Decorative glow overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-[#fff9e6]/10 to-transparent pointer-events-none" />

          {/* Title */}
          <h2 className="relative text-4xl md:text-5xl font-serif text-[#8B0000] text-center mb-8 tracking-wide">
            Biography
          </h2>

          {/* Content */}
          <div className="space-y-8 text-lg leading-relaxed text-[#3B1A00] text-justify">
            {/* 🌸 Image + Text Layout (Image Left) */}
            <div className="md:flex md:items-start md:gap-10 md:flex-row-reverse">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1"
              >
                <p className="mb-3">
                  A divine soul was born in the small yet blessed village of{" "}
                  <strong>Dhamtari</strong> (Chhattisgarh) on{" "}
                  <strong>11 May 1970</strong> — none other than{" "}
                  <strong>Bharat Gaurav Acharyashri 108 Pulak Sagar Ji Gurudev</strong>.
                  His arrival brought joy, honor, and peace to the family of{" "}
                  <strong>Shravak Shresthi Late. Shri Bhikamchand Jain</strong> and{" "}
                  <strong>Mahila Ratna Late. Smt. Gopi Devi ‘Kusum’ Jain</strong>.
                  Before initiation, his name was <strong>Singhai Paras Jain</strong> (Guddu/Dai) — a name
                  that reflected the purity and brilliance of his spirit.
                </p>
                <p>
                  Raised in a deeply religious Jain family, Paras Ji developed a natural inclination
                  toward spiritual texts. He listened with devotion to Jain scriptures from his mother
                  and grandmother — the early seeds of renunciation were sown in his heart. The family
                  astrologer foretold that he would become a great saint, illuminating countless lives.
                </p>
              </motion.div>

              {/* Image (Now on Left) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative mt-6 md:mt-0 md:w-[340px] flex-shrink-0"
              >
                {/* Golden glow behind the image */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#FFD97A]/50 via-[#FFF6C5]/40 to-transparent blur-md"></div>

                <Image
                  src="/images/gallery/maharaj/7.jpg"
                  alt="Acharyashri Pulak Sagar Ji"
                  width={340}
                  height={500}
                  className="relative rounded-3xl border-4 border-[#FFD97A]/70 shadow-[0_0_40px_rgba(255,217,122,0.4)] object-cover mx-auto"
                />

                <p className="text-center text-sm mt-3 text-[#7A4000] italic font-medium">
                  “Spreading the light of Jain wisdom with compassion and truth.”
                </p>
              </motion.div>
            </div>

            {/* 🌼 Remaining Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <p>
                At <strong>23</strong>, after meeting{" "}
                <strong>Acharya Shri Vidyasagar Ji Gurudev</strong>, his quest for truth intensified.
                Realizing the impermanence of material life, he took{" "}
                <strong>Brahmacharya Vrat</strong> on <strong>27 January 1993</strong> at{" "}
                <em>Madhiya Ji Tirth, Jabalpur (M.P.)</em>. Impressed by his determination and purity,{" "}
                <strong>Acharya Shri Pushpadant Sagar Ji</strong> honored him with{" "}
                <strong>Alok Diksha</strong> on <strong>27 January 1994</strong> at{" "}
                <em>Gopachal Parvat, Gwalior</em>, granting him the sacred{" "}
                <em>pichhi</em> and <em>kamandal</em>. He received{" "}
                <strong>Muni Diksha</strong> on <strong>11 December 1995</strong> at{" "}
                <em>Anandpuri, Kanpur (U.P.)</em>.
              </p>

              <p>
                By the divine grace of his Gurus, Muni Shri 108 Pulak Sagar Ji discovered the ultimate
                truth. Moving beyond pride and attachment, he began tireless{" "}
                <em>vihar</em> — traveling across metros and remote villages alike (Delhi, Meerut, Agra,
                Gwalior, Jaipur, Indore, Mumbai, Surat, Nagpur, Ajmer, Saharanpur, Sikar, and more) to
                spread the light of Jain dharma with a heart full of compassion.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>



      {/* DIKSHA TIMELINE */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-serif text-[#8B0000] mb-6">Diksha Journey</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              title: 'Brahmacharya Vrat',
              date: '27 Jan 1993',
              place: 'Madhiya Ji Tirth, Jabalpur (M.P.)',
              icon: <Shield className="w-6 h-6" />,
            },
            {
              title: 'Ailak / Alok Diksha',
              date: '27 Jan 1994',
              place: 'Gopachal Parvat, Gwalior (M.P.)',
              icon: <Swords className="w-6 h-6" />,
            },
            {
              title: 'Muni Diksha',
              date: '11 Dec 1995',
              place: 'Anandpuri, Kanpur (U.P.)',
              icon: <User className="w-6 h-6" />,
            },
            {
              title: 'Acharya Pad',
              date: '29 Nov 2019',
              place: 'Pushpagiri Tirth (M.P.)',
              icon: <Medal className="w-6 h-6" />,
            },
          ].map((i, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#FFF1C8] border border-[#ECA400]/40 p-5 shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3 text-[#8B0000] font-semibold">
                {i.icon}
                <span>{i.title}</span>
              </div>
              <p className="mt-2 text-sm text-[#6B3F00]">{i.date}</p>
              <p className="text-[#3A0A00] text-justify">{i.place}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-[#3A0A00] text-justify">
          With a single purpose — <em>seva</em> and <em>dharma-prabhavana</em> — Gurudev reached even the most remote
          villages lacking basic infrastructure, ensuring the message of truth and non-violence touches every heart.
        </p>
      </section>

      {/* INSPIRATION OF JINSHARNAM TIRTH */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center rounded-3xl bg-gradient-to-br from-[#FFF8E1] to-[#FFE8A0] border border-[#FFD700]/40 p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(196,90,0,0.25)]">
          <div>
            <h2 className="text-3xl font-serif text-[#8B0000] mb-4">Inspiration of Jinsharnam Tirth</h2>
            <p className="text-lg leading-relaxed text-justify">
              Through the inspiration of <strong>Bharat Gaurav Acharyashri Pulak Sagar Ji</strong>, another sacred
              pilgrimage has adorned our nation — <strong>Jinsharnam Tirth Jain Digambar Temple</strong>,
              <em> Upalat, Maharashtra — 401606</em>. Its <em>Panch Kalyanak</em> was completed on
              <strong> 22 February 2024</strong>.
            </p>
            <p className="mt-4 text-justify">
              <strong>Address:</strong> Mumbai-Surat Highway No 48, Mukaam Post, Uplat, Tehsil Talasari, District Palghar, Maharashtra-401606
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/organization/jinsharnam-tirth"
                className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-6 py-2 font-semibold text-[#3A0A00] shadow hover:scale-[1.02] transition"
              >
                <Landmark className="w-5 h-5" />
                Explore Tirth →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#C45A00] px-6 py-2 font-semibold text-white shadow hover:scale-[1.02] transition"
              >
                Contact Office
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD580]/40 to-transparent rounded-3xl blur-3xl" />
            <Image
              src="/images/img13.jpg"
              alt="Jinsharnam Tirth"
              width={560}
              height={400}
              className="relative z-10 rounded-3xl border-4 border-[#C45A00]/40 shadow-2xl object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* PROFILE OVERVIEW GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-serif text-[#8B0000] mb-6">Profile Overview</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <User />, label: 'Former Name', value: 'Singhai Paras Jain (Guddu, Dai)' },
            { icon: <Calendar />, label: 'Date of Birth', value: '11 May 1970' },
            { icon: <MapPin />, label: 'Place of Birth', value: 'Dhamtari (Chhattisgarh)' },
            { icon: <MapPin />, label: 'Native Town', value: 'Pindrai (M.P.)' },
            { icon: <Users />, label: 'Father', value: 'Shravak Shresthi Late. Bhikamchand Jain' },
            { icon: <Users />, label: 'Mother', value: "Mahila Ratna Late. Gopi Devi 'Kusum' Jain" },
            { icon: <GraduationCap />, label: 'Secular Education', value: 'B.A.' },
            { icon: <Calendar />, label: 'Home Renunciation', value: '27 January 1993' },
            { icon: <BookOpen />, label: 'Celibacy Vrat', value: 'Acharya Shri Vidyasagar Ji, Madhiya Ji Tirth, Jabalpur (M.P.)' },
            { icon: <BookOpen />, label: 'Ailak / Alok Diksha', value: '27 Jan 1994, Gopachal Parvat, Gwalior (M.P.)' },
            { icon: <BookOpen />, label: 'Muni Diksha', value: '11 Dec 1995, Anandpuri, Kanpur (U.P.)' },
            { icon: <Medal />, label: 'Acharya Post', value: '29 Nov 2019, Pushpagiri Tirth (M.P.)' },
            { icon: <Users />, label: 'Initiation Guru', value: 'Acharya Shri Pushpadant Sagar Ji, Pushpagiri Praneta' },
            { icon: <Quote />, label: 'Identity', value: 'Heart-touching preaching; explains complex spirituality with simplicity & humor' },
            { icon: <Rss />, label: 'Mouthpiece / Magazine', value: "‘Pulak Vani’ (Monthly)" },
            { icon: <Medal />, label: 'Honors', value: 'Bharat Gaurav, Rashtra Sant Vishwasant, Shantidoot, Rajkiya Atithi (many states)' },
            { icon: <BookOpen />, label: 'Literature', value: 'Dozens of books; powerful, practical writing' },
            { icon: <Users />, label: 'Organization', value: 'Akhil Bhartiya Pulak Manch Family' },
            { icon: <Landmark />, label: 'Central Office', value: "‘Vatsalya Bhawan’, P-75, Street No. 5, Bihari Colony, Shahdara, Delhi - 110032" },
            { icon: <Landmark />, label: 'Pilgrimage Inspiration', value: 'Shri Digambar Jain Teerthdham Jinsharnam (Upalat, M.H.)' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#FFF1C8] border border-[#ECA400]/40 p-5 shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-[#C45A00] mt-1">{item.icon}</span>
                <div>
                  <p className="text-sm uppercase tracking-wide text-[#A43B00]">{item.label}</p>
                  <p className="mt-1 text-[#3A0A00] text-justify">{item.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chaturmas note */}
        <p className="mt-6 text-[#3A0A00] text-justify">
          <strong>Chaturmas (since 1993)</strong>: Baroda, Etawah, Kanpur, Delhi, Saharanpur, Meerut, Agra, Gwalior,
          Jaipur, Indore, Nagpur, Mumbai, Surat, Udaipur, Banswara, Sikar, Ajmer, Baramati, Pune, Aurangabad, and
          multiple stays at Jinsharnam Teerthdham (M.H.), among others.
        </p>
      </section>

      {/* SOCIAL / PROFILE HANDLER */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF8E1] to-[#FFE8A0] border border-[#FFD700]/40 p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(196,90,0,0.25)]">
          <h2 className="text-2xl md:text-3xl font-serif text-[#8B0000] mb-4">Profile Handler</h2>
          <p className="text-justify">
            All social media channels of <strong>Bharat Gaurav Acharyashri Pulak Sagar Ji</strong> are operated by
            <strong> Jinsharnam Media</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/media/videos"
              className="inline-block rounded-full bg-[#FBBF24] px-6 py-2 font-semibold text-[#3A0A00] shadow hover:scale-[1.02] transition"
            >
              Watch on YouTube →
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-[#C45A00] px-6 py-2 font-semibold text-white shadow hover:scale-[1.02] transition"
            >
              Blessings to Jinsharnam Media
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
