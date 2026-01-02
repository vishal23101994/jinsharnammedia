"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaTelegramPlane,
  FaPinterestP,
  FaBloggerB,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FloatingSocialBar() {
  const [isOpen, setIsOpen] = useState(true);

  const socialLinks = [
    { icon: <FaYoutube className="text-[#FF0000]" />, url: "https://youtube.com/@jinsharnammedia?si=7H1TrEVFK6rjI5qu" },
    { icon: <FaFacebookF className="text-[#1877F2]" />, url: "https://www.facebook.com/Jinsharnammedia" },
    { icon: <FaInstagram className="text-[#E1306C]" />, url: "https://www.instagram.com/jinsharnam_media" },
    { icon: <FaTwitter className="text-white" />, url: "https://x.com/jinsharnamedia" },
    { icon: <FaLinkedinIn className="text-[#0077B5]" />, url: "https://www.linkedin.com/company/jinsharnammedia/" },
    { icon: <FaTelegramPlane className="text-[#0088cc]" />, url: "https://t.me/Jinsharnam_Media" },
    { icon: <FaPinterestP className="text-[#E60023]" />, url: "https://www.pinterest.com/jinsharnam/" },
    { icon: <FaBloggerB className="text-[#FF5722]" />, url: "https://jindharnam.blogspot.com/" },
  ];

  return (
    <div
      className={`fixed top-1/3 z-50 flex items-center transition-all duration-300 ${
        isOpen ? "left-0" : "left-[-60px]"
      }`}
    >
      {/* 🌟 Social Bar */}
      <div
        className={`relative bg-gradient-to-b from-[#4B0000]/90 to-[#1a0000]/90 backdrop-blur-md border border-yellow-700/40 rounded-r-2xl shadow-2xl px-3 py-4 flex flex-col items-center gap-4 transition-all duration-300 ${
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12 pointer-events-none"
        }`}
      >
        {socialLinks.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:scale-125 transition-transform duration-300"
          >
            {link.icon}
          </Link>
        ))}
      </div>

      {/* 🌼 Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#3A0A00] shadow-lg rounded-r-full w-8 h-12 flex items-center justify-center transition-all duration-300 ${
          isOpen ? "left-[100%]" : "left-[60px]"
        } hover:shadow-amber-300/40 hover:scale-105`}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
}
