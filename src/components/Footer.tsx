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
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export function Footer() {
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
        { name: "Pulakmunch", path: "/organization/pulakmunch" },
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
    { icon: <FaTwitter />, url: "https://twitter.com/jinsharanam", color: "#FFFFFF", label: "X" },
    { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/company/jinsharnammedia/", color: "#0077B5" },
    { icon: <FaTelegramPlane />, url: "https://t.me/Jinsharnam_Media", color: "#0088cc" },
    { icon: <FaPinterestP />, url: "https://www.pinterest.com/jinsharnam/", color: "#E60023" },
    { icon: <FaBloggerB />, url: "https://jindharnam.blogspot.com/", color: "#FF5722" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#2d0000] via-[#4B0000] to-[#1a0000] text-yellow-100 border-t border-yellow-700/30 pt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        {/* 🌼 1. Logo + Message */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-yellow-700/30 pb-6">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo.jpg"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-3 text-sm border-b border-yellow-700/30 pb-6">
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-yellow-700/30 pb-6">
          {/* Left: Contact */}
          <div className="text-xs sm:text-sm text-yellow-100/90 text-left leading-relaxed space-y-2 w-full md:w-1/2">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              Vatsalya Bhawan, P-75, Street Number 5, Bihari Colony Extension, Bihari Colony, Shahdara, Delhi – 110032
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" />
              <a
                href="tel:+919876543210"
                className="hover:text-yellow-400 transition"
              >
                +91 98765 43210
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              <a
                href="mailto:contact@jinsharnammedia.com"
                className="hover:text-yellow-400 transition"
              >
                contact@jinsharnammedia.com
              </a>
            </p>
          </div>

          {/* Right: Social Icons with Glow */}
          <div className="flex flex-wrap justify-center md:justify-end gap-5 w-full md:w-1/2">
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

        {/* 🌸 4. Copyright */}
        <div className="text-xs text-yellow-300/80 font-light text-center pt-4 pb-2">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-yellow-400">Jinsharnam Media</span> ·
          Spreading Peace · Faith · Knowledge 🌼
        </div>
      </div>
    </footer>
  );
}
