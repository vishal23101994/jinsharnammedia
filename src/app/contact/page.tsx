"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FloatingParticles from "@/components/FloatingParticles";
import { MapPin, Mail, Phone, Train, Bus, TramFront } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<null | "idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // basic client-side validation
    if (
      !formData.get("name") ||
      !formData.get("email") ||
      !formData.get("phone") ||
      !formData.get("message")
    ) {
      setErrorMsg("Please fill all fields.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed with status ${res.status}`);
      }

      setStatus("success");
      form.reset();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <section
      className="
        relative min-h-screen overflow-hidden
        bg-[#2A0000]
        text-white
        px-6 py-24
      "
    >
      <FloatingParticles count={25} />

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,217,122,0.15),transparent_40%)] pointer-events-none" />

      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FFD97A]/10 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFD97A]/10 rounded-full blur-3xl" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center mb-16 max-w-4xl mx-auto"
      >
        <div className="inline-block px-5 py-2 rounded-full border border-[#FFD97A]/30 bg-[#FFD97A]/10 backdrop-blur-md mb-6">
          <p className="text-[#FFD97A] tracking-[0.25em] uppercase text-xs">
            Jinsharnam Media
          </p>
        </div>

        <h1
          className="
            font-serif text-5xl md:text-7xl
            text-[#FFD97A]
            drop-shadow-[0_0_25px_rgba(255,217,122,0.35)]
            leading-tight
          "
        >
          Contact Us
        </h1>

        <p className="mt-6 text-[#FFF8E7] text-lg leading-relaxed">
          Have questions, suggestions, collaboration ideas, or wish to connect with
          Jinsharnam Media? We would be delighted to hear from you.
        </p>
      </motion.div>

      {/* Form Card */}
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-stretch">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="
            relative overflow-hidden
            bg-[#4B0000]/70 backdrop-blur-xl
            border border-[#FFD97A]/20
            rounded-[2.5rem]
            p-8 md:p-12
            shadow-[0_0_60px_rgba(255,217,122,0.12)]
          "
        >
          <form className="grid gap-5 text-left" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                required
                className="
                  w-full p-4 rounded-2xl
                  bg-black/20
                  border border-[#FFD97A]/20
                  text-[#FFF8E7]
                  placeholder-[#FFF8E7]/40
                  focus:outline-none
                  focus:border-[#FFD97A]
                  focus:bg-[#FFF8E7]/10
                  transition-all
                "
              />
              {/* New phone input */}
              <input
                name="phone"
                type="tel"
                placeholder="Contact Number"
                required
                // optional: simple pattern for Indian mobile numbers
                pattern="^[0-9+\-\s()]{7,15}$"
                className="
                  w-full p-4 rounded-2xl
                  bg-black/20
                  border border-[#FFD97A]/20
                  text-[#FFF8E7]
                  placeholder-[#FFF8E7]/40
                  focus:outline-none
                  focus:border-[#FFD97A]
                  focus:bg-[#FFF8E7]/10
                  transition-all
                "
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className="
                w-full p-4 rounded-2xl
                bg-black/20
                border border-[#FFD97A]/20
                text-[#FFF8E7]
                placeholder-[#FFF8E7]/40
                focus:outline-none
                focus:border-[#FFD97A]
                focus:bg-[#FFF8E7]/10
                transition-all
              "
            />

            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="
                w-full p-4 rounded-2xl
                bg-black/20
                border border-[#FFD97A]/20
                text-[#FFF8E7]
                placeholder-[#FFF8E7]/40
                focus:outline-none
                focus:border-[#FFD97A]
                focus:bg-[#FFF8E7]/10
                transition-all
              "
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="
                w-full py-4 rounded-2xl
                bg-gradient-to-r from-[#FFD97A] via-[#FFE7A8] to-[#FFD97A]
                text-[#4B1E00]
                font-bold tracking-wide
                shadow-[0_10px_30px_rgba(255,217,122,0.35)]
                hover:shadow-[0_15px_45px_rgba(255,217,122,0.55)]
                hover:scale-[1.02]
                transition-all duration-300
              "
              aria-busy={status === "loading"}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </motion.button>

            {status === "success" && (
              <p className="text-green-400 mt-2">Message sent — thanks!</p>
            )}
            {status === "error" && (
              <p className="text-red-400 mt-2">Error: {errorMsg}</p>
            )}
          </form>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="
            rounded-[2.5rem]
            border border-[#FFD97A]/20
            bg-gradient-to-br from-[#5A0000]/70 to-[#2A0000]/80
            backdrop-blur-xl
            p-10
            shadow-[0_0_60px_rgba(255,217,122,0.12)]
            h-full
            flex flex-col
          "
        >
          <h3 className="text-3xl font-serif text-[#FFD97A] mb-8">
            Reach Us
          </h3>

          <div className="space-y-6 flex-1 flex flex-col justify-center">

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-[#FFD97A]/10">
              <MapPin className="text-[#FFD97A] mt-1" />
              <p className="text-[#FFF8E7]/80 text-sm leading-relaxed">
                Vatsalya Bhawan, P-75, Street Number 5, Near Dua Chai Waale, Bihari Colony Extension, 
                Bihari Colony, Shahdara, Delhi – 110032
              </p>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-[#FFD97A]/10">
              <Phone className="text-[#FFD97A] mt-1" />
              <div>
                <p className="text-[#FFF8E7]">+91 9910987666</p>
                <p className="text-[#FFF8E7]">+91 9810900699</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-[#FFD97A]/10">
              <Mail className="text-[#FFD97A] mt-1" />
              <p className="text-[#FFF8E7]">
                jinsharnam@gmail.com
              </p>
            </div>

          </div>
        </motion.div>
      </div>

      {/* HOW TO REACH OUR OFFICE – ENHANCED */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 mt-14 w-full max-w-6xl mx-auto
                   bg-gradient-to-br from-[#4a0000]/90 via-[#3a0000]/90 to-[#2a0000]/90
                   backdrop-blur-md
                   border border-[#FFD97A]/30
                   rounded-[2rem]
                   shadow-[0_0_50px_rgba(255,217,122,0.18)]
                   px-6 md:px-10 py-10"
      >
        {/* Heading */}
        <h2 className="text-center font-serif text-3xl md:text-4xl text-[#FFD97A] mb-10">
          How to Reach Our Office
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-[#FFF8E7]">

          {/* METRO CARD */}
          <div className="rounded-[2rem] p-8 bg-gradient-to-b from-white/10 to-white/[0.03] backdrop-blur-xl border border-[#FFD97A]/15 hover:border-[#FFD97A]/40 hover:-translate-y-2 transition-all duration-500 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3 mb-4">
              <TramFront className="text-[#FFD97A]" size={28} />
              <h3 className="text-xl font-semibold text-[#FFD97A]">
                Metro Stations
              </h3>
            </div>

            <ul className="space-y-4 text-sm leading-relaxed">
              <li>
                <p className="font-semibold">Shahdara Metro Station</p>
                <p className="text-[#FFF8E7]/70">
                  Red Line • ~1.2 km<br />
                  Auto / E-rickshaw easily available
                </p>
              </li>

              <li>
                <p className="font-semibold">Welcome Metro Station</p>
                <p className="text-[#FFF8E7]/70">
                  Red Line / Pink Line (Interchange)<br />
                  ~2.3 km • Excellent connectivity
                </p>
              </li>

              <li>
                <p className="font-semibold">East Azad Nagar Metro Station</p>
                <p className="text-[#FFF8E7]/70">
                  Pink Line • ~2.0 km<br />
                  Convenient from North & East Delhi
                </p>
              </li>
            </ul>
          </div>

          {/* RAILWAY CARD */}
          <div className="rounded-[2rem] p-8 bg-gradient-to-b from-white/10 to-white/[0.03] backdrop-blur-xl border border-[#FFD97A]/15 hover:border-[#FFD97A]/40 hover:-translate-y-2 transition-all duration-500 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3 mb-4">
              <Train className="text-[#FFD97A]" size={28} />
              <h3 className="text-xl font-semibold text-[#FFD97A]">
                Railway Station
              </h3>
            </div>

            <p className="font-semibold">Shahdara Junction (SDA)</p>
            <p className="text-sm text-[#FFF8E7]/70 mt-1">
              ~1.5 km distance<br />
              5–10 minutes by auto or cab
            </p>
          </div>

          {/* BUS CARD */}
          <div className="rounded-[2rem] p-8 bg-gradient-to-b from-white/10 to-white/[0.03] backdrop-blur-xl border border-[#FFD97A]/15 hover:border-[#FFD97A]/40 hover:-translate-y-2 transition-all duration-500 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3 mb-4">
              <Bus className="text-[#FFD97A]" size={28} />
              <h3 className="text-xl font-semibold text-[#FFD97A]">
                Bus Stop
              </h3>
            </div>

            <p className="font-semibold">Bihari Colony Bus Stop</p>
            <p className="text-sm text-[#FFF8E7]/70 mt-1">
              Walking distance<br />
              ~2–3 minutes from office
            </p>
          </div>

        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="
          relative z-10 mt-20
          w-full max-w-6xl mx-auto
          rounded-[2.5rem]
          overflow-hidden
          border border-[#FFD97A]/20
          bg-white/5
          backdrop-blur-xl
          p-3
          shadow-[0_0_60px_rgba(255,217,122,0.15)]
        "
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6161988496186!2d77.2825304!3d28.6687881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd6a53b21e8b%3A0xc9c8d1cd61d3854b!2sJinsharnam%20Media!5e0!3m2!1sen!2sin!4v1730663000000!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-3xl"
        ></iframe>
      </motion.div>
    </section>
  );
}
