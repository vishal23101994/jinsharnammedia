"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plane,
  Train,
  Bus,
  Users,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function JinsharnamTirthPage() {
  const bookRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [trustees, setTrustees] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const images = [
    "/images/tirth/part-1.2.jpg",
    "/images/tirth/part-2.1.jpg",
    "/images/tirth/part-2.2.jpg",
    "/images/tirth/part-3.1.jpg",
    "/images/tirth/part-3.2.jpg",
    "/images/tirth/part-4.1.jpg",
    "/images/tirth/part-4.2.jpg",
    "/images/tirth/part-5.1.jpg",
    "/images/tirth/part-5.2.jpg",
    "/images/tirth/part-6.1.jpg",
    "/images/tirth/part-6.2.jpg",
    "/images/tirth/part-7.1.jpg",
    "/images/tirth/part-7.2.jpg",
    "/images/tirth/part-8.1.jpg",
    "/images/tirth/part-8.2.jpg",
    "/images/tirth/part-9.1.jpg",
    "/images/tirth/part-9.2.jpg",
    "/images/tirth/part-10.1.jpg",
    "/images/tirth/part-10.2.jpg",
    "/images/tirth/part-11.1.jpg",
    "/images/tirth/part-11.2.jpg",
    "/images/tirth/part-12.1.jpg",
    "/images/tirth/part-12.2.jpg",
    "/images/tirth/part-1.1.jpg",
  ];

  const hostelGallery = [
    "/images/tirth/1.1.jpeg",
    "/images/tirth/1.2.jpeg",
    "/images/tirth/1.3.jpeg",
    "/images/tirth/1.4.jpeg",
    "/images/tirth/1.5.jpeg",
    "/images/tirth/1.6.jpeg",
  ];

  // responsive setup
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // gentle preview flip
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flipNext();

        setTimeout(() => {
          if (bookRef.current?.pageFlip) {
            bookRef.current.pageFlip().flipPrev();
          }
        }, 1200);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // dynamic trustees
  useEffect(() => {
    fetch("/api/trustees")
      .then((res) => res.json())
      .then((data) => setTrustees(data))
      .catch((err) => console.error("Error loading trustees:", err));
  }, []);

  const totalPages = Math.ceil(trustees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = trustees.slice(startIndex, startIndex + itemsPerPage);

  const nextBookPage = () => bookRef.current?.pageFlip()?.flipNext();
  const prevBookPage = () => bookRef.current?.pageFlip()?.flipPrev();

  // 🔽 ADD THIS ABOVE `return (`
  const handleExportToExcel = () => {
    if (!trustees || trustees.length === 0) {
      alert("No data available to export");
      return;
    }

    const exportData = trustees.map((t, index) => ({
      "S.No": index + 1,
      Name: t.NAME || "",
      Designation: t.DESIGNATION || "",
      Address: t.ADDRESS || "",
      Mobile: t.MOBILE || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trustee Committee");
    XLSX.writeFile(workbook, "Trustee_Committee.xlsx");
  };

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="text-gray-800 bg-gradient-to-b from-amber-50 to-white min-h-screen overflow-x-hidden">
      {/* 🌅 Hero Section */}
      <div className="relative w-full h-[500px] md:h-[600px] mb-6 overflow-hidden">

        {/* Background Image */}
        <img
          src="/images/img13.jpg"
          alt="Jinsharnam Tirth"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 text-amber-100 px-4">

          {/* Heading - positioned slightly upper */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center w-full px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-semibold mb-4 drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)]">
              Jinsharnam Tirth Dham
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              A serene sanctuary of peace and devotion guided by
              <br className="hidden md:block" />
              Acharya Shri Pulak Sagar Ji Maharaj
            </p>
          </div>

          {/* Donate Button - positioned lower */}
          <div className="absolute top-[85%] left-1/2 -translate-x-1/2">
            <button
              onClick={() =>
                document
                  .getElementById("donate-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="
                px-10 py-4
                text-lg md:text-l font-semibold
                rounded-full
                text-[#4B1E00]
                bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300
                shadow-[0_15px_40px_rgba(251,191,36,0.7)]
                hover:shadow-[0_20px_60px_rgba(251,191,36,0.95)]
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              🙏 Donate Now
            </button>
          </div>

        </div>
      </div>

      {/* 📖 Flipbook Section — Wider View, Full Image, No Cropping */}
      <div className="flex justify-center items-center my-6">
        <div
          className="relative flex justify-center items-center overflow-visible"
          style={{
            width: isMobile ? "95%" : "92%",
            maxWidth: "1400px",
          }}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={isMobile ? 400 : 700}
            height={isMobile ? 460 : 520}
            // 🔹 Required props from IProps typing:
            startPage={0}
            size="stretch"
            minWidth={300}
            maxWidth={1400}
            minHeight={400}
            maxHeight={800}
            maxShadowOpacity={0.3}
            showCover
            mobileScrollSupport
            flippingTime={900}
            drawShadow={false}
            usePortrait={isMobile}
            showPageCorners
            disableFlipByClick={false}
            autoSize
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            startZIndex={0}
            className="bg-transparent border-none shadow-none"
            style={{
              background: "transparent",
              boxShadow: "none",
              border: "none",
              margin: "0 auto",
            }}
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="flex items-center justify-center bg-[#f9f3e5] overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  className="w-full h-full object-contain select-none pointer-events-none"
                  draggable="false"
                />
              </div>
            ))}
          </HTMLFlipBook>

          {/* Navigation Buttons */}
          {!isMobile && (
            <>
              <button
                onClick={prevBookPage}
                className="absolute left-[-30px] top-100px -translate-y-1/2 bg-[#4B1E00]/90 text-yellow-100 hover:bg-yellow-400 hover:text-[#4B1E00] rounded-full w-12 h-12 flex items-center justify-center shadow-md border border-yellow-600 hover:scale-110 transition-all"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                onClick={nextBookPage}
                className="absolute right-[-30px] top-100px -translate-y-1/2 bg-[#4B1E00]/90 text-yellow-100 hover:bg-yellow-400 hover:text-[#4B1E00] rounded-full w-12 h-12 flex items-center justify-center shadow-md border border-yellow-600 hover:scale-110 transition-all"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 🖼️ Jinsharnam Chhatrawas Gallery */}
      <div className="bg-gradient-to-b from-[#FFF8E7] to-[#FFECC7] py-14 border-t border-amber-300">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl text-center font-serif text-[#4B1E00] font-semibold mb-8">
            Jinsharnam Chatravas
          </h2>

          {/* 🖼️ Jinsharnam Chhatrawas Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {hostelGallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Gallery ${i + 1}`}
                onClick={() => {
                  setActiveImage(img);
                  setActiveIndex(i);
                }}
                className="
                  cursor-pointer
                  h-[300px]
                  w-auto
                  mx-auto
                  object-contain
                  rounded-lg
                  border-2 border-amber-400
                  shadow-[0_0_25px_rgba(251,191,36,0.6)]
                  hover:scale-105
                  transition-all
                "
              />
            ))}
          </div>
        </div>
      </div>
      {/* 🔍 Image Zoom Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">

          {/* CLOSE */}
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-100 text-white text-4xl hover:scale-110 transition z-50"
          >
            ✕
          </button>

          {/* PREVIOUS */}
          <button
            onClick={() =>
              setActiveIndex((prev) => {
                const newIndex = prev === 0 ? hostelGallery.length - 1 : prev - 1;
                setActiveImage(hostelGallery[newIndex]);
                return newIndex;
              })
            }
            className="absolute left-100 text-white text-5xl hover:scale-110 transition z-50"
          >
            ‹
          </button>

          {/* IMAGE ONLY – NO BOX */}
          <img
            src={activeImage}
            alt="Preview"
            className="
              max-h-[90vh]
              max-w-[90vw]
              object-contain
            "
          />

          {/* NEXT */}
          <button
            onClick={() =>
              setActiveIndex((prev) => {
                const newIndex = prev === hostelGallery.length - 1 ? 0 : prev + 1;
                setActiveImage(hostelGallery[newIndex]);
                return newIndex;
              })
            }
            className="absolute right-100 text-white text-5xl hover:scale-110 transition z-50"
          >
            ›
          </button>

          {/* DOWNLOAD */}
          <a
            href={activeImage}
            download
            className="
              absolute bottom-6
              px-6 py-3
              rounded-full
              bg-yellow-400
              text-[#4B1E00]
              font-semibold
              shadow-lg
              hover:scale-105
              transition
            "
          >
            ⬇ Download
          </a>

        </div>
      )}
      {/* 📍 Location Section */}
      <div className="bg-gradient-to-b from-[#FFF8E7] to-[#FFECC7] py-16 border-t border-amber-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-[#4B1E00] font-semibold mb-8">
            📍 Location — Shri Digambar Jain Jinsharnam Tirth Trust (Regd.)
          </h2>

          <p className="text-lg text-[#4B1E00]/90 mb-10">
            <MapPin className="inline-block mr-2 text-amber-600" size={20} />
            <strong>Address: </strong>Mumbai-Surat Highway No 48, Mukaam Post, Uplat, Tehsil Talasari, District Palghar, Maharashtra-401606
          </p>
          <p className="text-lg text-[#4B1E00]/90 mb-10">
            <strong>Contact: </strong>+91-7987176553, 8799598079
          </p>
          {/* 🏞️ Nearby Tourist Attractions & Connectivity */}
          <div className="bg-gradient-to-b from-[#FFFDF6] to-[#FFF1D6] py-16 border-t border-amber-300">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-serif text-[#4B1E00] font-semibold mb-10">
                Nearby Tourist Places & Connectivity
              </h2>

              {/* Tourist Places */}
              <div className="grid md:grid-cols-3 gap-8 mb-14">
                <div className="bg-white/80 p-6 rounded-xl shadow-md border border-amber-200">
                  <h3 className="font-semibold text-lg text-[#4B1E00] mb-3">
                    🛕 Religious & Spiritual
                  </h3>
                  <ul className="text-sm space-y-2 text-[#4B1E00]/90">
                    <li>Taranga Jain Temple — 120 km</li>
                    <li>Palitana Jain Temples — 230 km</li>
                    <li>Shri Mahavir Jain Temple, Vapi — 25 km</li>
                  </ul>
                </div>

                <div className="bg-white/80 p-6 rounded-xl shadow-md border border-amber-200">
                  <h3 className="font-semibold text-lg text-[#4B1E00] mb-3">
                    🌿 Nature & Scenic
                  </h3>
                  <ul className="text-sm space-y-2 text-[#4B1E00]/90">
                    <li>Dahanu Beach — 45 km</li>
                    <li>Vansda National Park — 110 km</li>
                    <li>Tithal Beach — 70 km</li>
                    <li>Silvassa Gardens & Damanganga River — 30 km</li>
                  </ul>
                </div>

                <div className="bg-white/80 p-6 rounded-xl shadow-md border border-amber-200">
                  <h3 className="font-semibold text-lg text-[#4B1E00] mb-3">
                    🏙️ Nearby Cities & Leisure
                  </h3>
                  <ul className="text-sm space-y-2 text-[#4B1E00]/90">
                    <li>Vapi — 20 km</li>
                    <li>Silvassa — 30 km</li>
                    <li>Daman — 55 km</li>
                    <li>Surat — 140 km</li>
                  </ul>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-[#4B1E00]/90">
                <div className="flex flex-col items-center bg-white/70 p-6 rounded-xl shadow-md border border-amber-200">
                  <Plane className="text-amber-700 mb-3" size={32} />
                  <h3 className="font-semibold text-lg">Nearest Airports</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>Mumbai Intl. Airport — 140 km</li>
                    <li>Surat Airport — 140 km</li>
                    <li>Nashik Airport — 165 km</li>
                    <li>Pune Airport — 250 km</li>
                  </ul>
                </div>

                <div className="flex flex-col items-center bg-white/70 p-6 rounded-xl shadow-md border border-amber-200">
                  <Train className="text-amber-700 mb-3" size={32} />
                  <h3 className="font-semibold text-lg">Nearest Railway Stations</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>Mumbai Central — 140 km</li>
                    <li>Surat — 140 km</li>
                    <li>Nashik — 150 km</li>
                    <li>Vapi — 20 km</li>
                  </ul>
                </div>

                <div className="flex flex-col items-center bg-white/70 p-6 rounded-xl shadow-md border border-amber-200">
                  <Bus className="text-amber-700 mb-3" size={32} />
                  <h3 className="font-semibold text-lg">Nearest Bus Terminals</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>Vapi Bus Depot — 38 km</li>
                    <li>Dahanu Bus Stand — 45 km</li>
                    <li>Palghar ISBT — 55 km</li>
                    <li>Virar Bus Station — 70 km</li>
                    <li>Surat Central ISBT — 110 km</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-xl overflow-hidden shadow-lg border border-amber-300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.963588501987!2d72.8999775!3d20.1975307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be73281a839e931%3A0x5ff5c55113a0cf30!2sJinsharanam%20Tirth%20Jain%20Digambar%20Temple!5e0!3m2!1sen!2sin!4v1730320320000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* 🙏 Trustee Committee Section */}
      <div className="bg-[#FFF8E7] py-16 border-t border-amber-300">
        <div className="max-w-6xl mx-auto px-6">

          {/* Heading + Export */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-serif text-[#4B1E00] font-semibold flex items-center gap-2">
              <Users className="text-amber-700" size={30} />
              Trustee Committee
            </h2>

            <button
              onClick={handleExportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition"
            >
              <Download size={18} />
              Export to Excel
            </button>
          </div>

          {/* Trustee Table */}
          <div className="overflow-x-auto shadow-lg rounded-xl border border-amber-200 bg-white/80">
            <table className="min-w-full text-[#4B1E00] text-left text-sm">
              <thead className="bg-gradient-to-r from-amber-200 to-amber-100 font-semibold">
                <tr>
                  <th className="py-2 px-3 border-b border-amber-300">S.No</th>
                  <th className="py-2 px-3 border-b border-amber-300">Name</th>
                  <th className="py-2 px-3 border-b border-amber-300">
                    Designation
                  </th>
                  <th className="py-2 px-3 border-b border-amber-300">Address</th>
                  <th className="py-2 px-3 border-b border-amber-300">Mobile</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((t, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-amber-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-amber-50/50"
                    }`}
                  >
                    <td className="py-2 px-3 border-b border-amber-200">
                      {startIndex + i + 1}
                    </td>

                    <td className="py-2 px-3 border-b border-amber-200 font-medium">
                      {t.NAME || "-"}
                    </td>

                    <td className="py-2 px-3 border-b border-amber-200">
                      {t.DESIGNATION || "-"}
                    </td>

                    <td className="py-2 px-3 border-b border-amber-200">
                      {t.ADDRESS || "-"}
                    </td>

                    <td className="py-2 px-3 border-b border-amber-200">
                      {t.MOBILE || "-"}
                    </td>
                  </tr>
                ))}

                {currentItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-gray-500"
                    >
                      No trustee data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4 sticky bottom-4 bg-[#FFF8E7]/80 py-2 backdrop-blur-sm rounded-lg">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-[#4B1E00] text-yellow-100 rounded-md hover:bg-yellow-400 hover:text-[#4B1E00] disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-[#4B1E00] font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-[#4B1E00] text-yellow-100 rounded-md hover:bg-yellow-400 hover:text-[#4B1E00] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🙏 Donation Section */}
      <div
        id="donate-section"
        className="bg-gradient-to-b from-amber-50 to-white py-20 border-t border-amber-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <h2 className="text-4xl font-serif text-[#4B1E00] font-semibold mb-4 text-center flex justify-center items-center gap-3">
            Support Jinsharnam Tirth Trust
          </h2>

          <p className="text-lg text-[#4B1E00]/90 text-center leading-relaxed max-w-3xl mx-auto mb-14">
            Your generous donation supports the maintenance and development of
            the sacred
            <strong> Jinsharnam Tirth</strong>. Every contribution is deeply
            appreciated.
          </p>

          {/* SIDE-BY-SIDE Sections */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT — Bank Transfer */}
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-amber-200">
              <h3 className="text-2xl font-serif text-[#4B1E00] font-semibold mb-6 flex items-center gap-2">
                <span className="text-xl" /> Bank Transfer
              </h3>

              <p className="text-lg font-semibold text-[#4B1E00] mb-8">
                SHRI DIGAMBAR JAIN JINSHARNAM TIRTH TRUST
              </p>

              {/* Account Number */}
              <div className="mb-6">
                <p className="text-sm text-[#4B1E00]/70">Account Number</p>

                <div className="flex items-center gap-3 mt-1">
                  <p className="font-mono text-xl font-bold">2565201000951</p>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText("2565201000951")
                    }
                    className="bg-amber-100 hover:bg-amber-200 transition px-4 py-1.5 rounded-lg text-sm font-medium text-[#4B1E00] shadow-sm"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* IFSC */}
              <div className="mb-6">
                <p className="text-sm text-[#4B1E00]/70">IFSC Code</p>

                <div className="flex items-center gap-3 mt-1">
                  <p className="font-mono text-xl font-bold">CNRB0002565</p>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText("CNRB0002565")
                    }
                    className="bg-amber-100 hover:bg-amber-200 transition px-4 py-1.5 rounded-lg text-sm font-medium text-[#4B1E00] shadow-sm"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* IFSC */}
              <div className="mb-6">
                <p className="text-sm text-[#4B1E00]/70">PAN</p>

                <div className="flex items-center gap-3 mt-1">
                  <p className="font-mono text-xl font-bold">AALTS9991H</p>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText("AALTS9991H")
                    }
                    className="bg-amber-100 hover:bg-amber-200 transition px-4 py-1.5 rounded-lg text-sm font-medium text-[#4B1E00] shadow-sm"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* Bank + Branch */}
              <p className="text-base mb-2">
                <span className="font-semibold">Bank:</span> Canara Bank
              </p>

              <p className="text-base">
                <span className="font-semibold">Branch:</span> Silvassa (DN)
              </p>
              <br/>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-6 flex items-center justify-center gap-2 text-emerald-700 text-lg font-semibold"
              >
                <CheckCircle size={30} strokeWidth={2.5} className="text-emerald-600" />
                Eligible for 80G Tax Exemption
              </motion.div>
            </div>

            {/* RIGHT — QR Code */}
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-amber-200 flex flex-col items-center">
              <h3 className="text-2xl font-serif text-[#4B1E00] font-semibold mb-6">
                UPI / QR Donation
              </h3>

              <div className="bg-white rounded-xl border border-amber-300 shadow-lg p-4">
                <img
                  src="/images/donation/jinsharnam_qr.jpg"
                  alt="UPI QR Code"
                  className="w-74 h-104 object-contain rounded-lg"
                />
              </div>

              <p className="text-[#4B1E00]/80 text-center mt-4 text-sm">
                Scan using GPay / PhonePe / Paytm / BHIM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
