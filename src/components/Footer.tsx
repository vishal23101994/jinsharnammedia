"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaTelegramPlane,
  FaPinterestP,
  FaBloggerB,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobeAsia,
} from "react-icons/fa";

export function Footer() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const alreadyVisited = localStorage.getItem("visited");

        // Increment only first time
        if (!alreadyVisited) {
          const postRes = await fetch("/api/visitors", {
            method: "POST",
          });

          const postData = await postRes.json();

          setVisitors(postData.count);

          localStorage.setItem("visited", "true");
        } else {
          const getRes = await fetch("/api/visitors");

          const getData = await getRes.json();

          setVisitors(getData.count);
        }
      } catch (error) {
        console.error("Visitor counter error:", error);
      }
    };

    fetchVisitors();
  }, []);
  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Pulak Sagar Ji", path: "/pulak-sagar" },
    { name: "Gallery", path: "/gallery" },
    { name: "Services", path: "/services" },
    // { name: "Achievements", path: "/achievements" },
    { name: "Store", path: "/store" },
    { name: "Directory", path: "/directory" },
    { name: "Contact", path: "/contact" },
    {
      name: "Organization",
      subLinks: [
        { name: "Jinsharnam Tirth", path: "/organization/jinsharnam-tirth" },
        { name: "Vatsalya Dhara", path: "/organization/vatsalya-dhara" },
        { name: "Pulak Manch", path: "/organization/pulak-manch" },
      ],
    },
    {
      name: "Media",
      subLinks: [
        { name: "Videos", path: "/media/videos" },
        { name: "Audio", path: "/media/audio" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaYoutube />, url: "https://youtube.com/@jinsharnammedia?si=7H1TrEVFK6rjI5qu", color: "#FF0000" },
    { icon: <FaFacebookF />, url: "https://www.facebook.com/Jinsharnammedia", color: "#1877F2" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/jinsharnam_media", color: "#E1306C" },
    { icon: <FaTwitter />, url: "https://x.com/jinsharnamedia", color: "#FFFFFF", label: "X" },
    { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/company/jinsharnammedia/", color: "#0077B5" },
    { icon: <FaTelegramPlane />, url: "https://t.me/Jinsharnam_Media", color: "#0088cc" },
    { icon: <FaPinterestP />, url: "https://www.pinterest.com/jinsharnam/", color: "#E60023" },
    { icon: <FaBloggerB />, url: "https://jindharnam.blogspot.com/", color: "#FF5722" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#2d0000] via-[#4B0000] to-[#1a0000] text-yellow-100 border-t border-yellow-700/30 pt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        {/* 🌼 1. Logo + Message */}
        <div className="flex flex-col md:flex-row items-center md:items-start 
                justify-between gap-4 border-b border-yellow-700/30 pb-6
                text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src="/images/logo_new.png"
              alt="Jinsharnam Media Logo"
              className="w-14 h-14 rounded-full border-2 border-yellow-400/50 shadow-lg"
            />
            <div>
              <h2 className="font-serif text-2xl font-bold text-yellow-300">
                Jinsharnam <span className="text-yellow-400">Media</span>
              </h2>
              <p className="text-sm text-yellow-100/90 leading-relaxed">
                Spreading <em>truth, compassion, and peace</em> through digital storytelling and Jain philosophy.
              </p>
            </div>
          </div>
        </div>

        {/* 🌿 2. Explore Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 
                        gap-y-4 text-sm border-b border-yellow-700/30 pb-6">
          {footerLinks.map((item, idx) => (
            <div key={idx}>
              {item.subLinks ? (
                <>
                  <p className="font-semibold text-yellow-200 mb-1">{item.name}</p>
                  <ul className="space-y-1">
                    {item.subLinks.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={sub.path}
                          className="hover:text-yellow-400 transition"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={item.path} className="hover:text-yellow-400 transition block">
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* 🌐 3. Contact (Left) + Social (Right) */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 border-b border-yellow-700/30 pb-6 text-center md:text-left">
          {/* Left: Contact */}
          <div className="text-xs sm:text-sm text-yellow-100/90 leading-relaxed 
                          space-y-3 w-full md:w-1/2
                          text-center md:text-left">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              Vatsalya Bhawan, P-75, Street Number 5, Near Dua Chai Waale, Bihari Colony Extension, Bihari Colony, Shahdara, Delhi – 110032
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" />
              <a
                href="tel:+919876543210"
                className="hover:text-yellow-400 transition"
              >
                +91 9910987666, 9810900699
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              <a
                href="mailto:contact@jinsharnammedia.com"
                className="hover:text-yellow-400 transition"
              >
                jinsharnam@gmail.com
              </a>
            </p>
          </div>

          {/* Right: Social Icons with Glow */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 w-full md:w-1/2">
            {socialLinks.map((s, i) => (
              <Link
                key={i}
                href={s.url}
                target="_blank"
                className="transition-transform transform hover:scale-125 relative group"
                style={{ color: s.color }}
              >
                <span className="text-2xl drop-shadow-md transition-all duration-300 group-hover:drop-shadow-[0_0_10px_#FFD700]">
                  {s.icon}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 👀 Visitors Section */}
        <div className="flex justify-center">
          <div
            className="group relative overflow-hidden
                      bg-gradient-to-r from-yellow-500/10 to-yellow-300/5
                      border border-yellow-500/30
                      rounded-2xl px-8 py-4
                      shadow-xl backdrop-blur-md"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full bg-yellow-400/10
                          flex items-center justify-center
                          border border-yellow-400/20"
              >
                <FaGlobeAsia className="text-yellow-400 text-2xl" />
              </div>

              <div className="text-left">
                <p className="text-xs uppercase tracking-[3px] text-yellow-300/70">
                  Global Visitors
                </p>

                <h3 className="text-2xl font-bold text-yellow-400 tracking-wider">
                  {visitors !== null
                    ? visitors.toLocaleString()
                    : "Loading..."}
                  +
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 🌸 Bottom Copyright */}
        <div className="text-center pt-2 pb-4">
          <p className="text-xs text-yellow-300/80 tracking-wide">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-yellow-400">
              Jinsharnam Media
            </span>
          </p>

          <p className="text-[11px] text-yellow-200/60 mt-1">
            Spreading Peace · Faith · Knowledge 🌼
          </p>
        </div>

      </div>
    </footer>
  );
}
