"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const categories = {
    "Pulak Sagar Ji": [
      "/images/gallery/maharaj/1.jpeg", "/images/gallery/maharaj/2.jpg",
      "/images/gallery/maharaj/3.jpg", "/images/gallery/maharaj/4.jpg",
      "/images/gallery/maharaj/5.jpg", "/images/gallery/maharaj/6.jpg",
      "/images/gallery/maharaj/7.jpg", "/images/gallery/maharaj/8.jpg",
      "/images/gallery/maharaj/9.jpg", "/images/gallery/maharaj/10.jpg",
      "/images/gallery/maharaj/11.jpg", "/images/gallery/maharaj/12.jpg",
      "/images/gallery/maharaj/13.jpg", "/images/gallery/maharaj/14.jpg",
      "/images/gallery/maharaj/15.jpg", "/images/gallery/maharaj/16.jpg",
      "/images/gallery/maharaj/17.jpg", "/images/gallery/maharaj/18.jpg",
      "/images/gallery/maharaj/19.jpg", "/images/gallery/maharaj/20.jpg",
      "/images/gallery/maharaj/21.jpg", "/images/gallery/maharaj/22.jpg",
      "/images/gallery/maharaj/23.jpg", "/images/gallery/maharaj/24.jpg",
      "/images/gallery/maharaj/25.jpg", "/images/gallery/maharaj/26.jpg",
      "/images/gallery/maharaj/27.jpg", "/images/gallery/maharaj/28.jpg",
      "/images/gallery/maharaj/29.jpg", "/images/gallery/maharaj/30.jpg",
      "/images/gallery/maharaj/31.jpg", "/images/gallery/maharaj/32.jpg",
      "/images/gallery/maharaj/33.jpg", "/images/gallery/maharaj/34.jpg",
      "/images/gallery/maharaj/35.jpg", "/images/gallery/maharaj/36.jpg",
      "/images/gallery/maharaj/37.jpg", "/images/gallery/maharaj/38.jpg",
      "/images/gallery/maharaj/39.jpg", "/images/gallery/maharaj/40.jpg",
      "/images/gallery/maharaj/41.jpg", "/images/gallery/maharaj/42.jpg",
      "/images/gallery/maharaj/43.jpg", "/images/gallery/maharaj/44.jpg",
      "/images/gallery/maharaj/45.jpg", "/images/gallery/maharaj/img1.jpeg",
      "/images/gallery/maharaj/img2.jpeg", "/images/gallery/maharaj/img3.jpeg",
      "/images/gallery/maharaj/img4.jpeg", "/images/gallery/maharaj/img5.jpeg",
      "/images/gallery/maharaj/img6.jpeg", "/images/gallery/maharaj/img7.jpeg",
      "/images/gallery/maharaj/img8.jpeg", "/images/gallery/maharaj/img9.jpeg",
      "/images/gallery/maharaj/img10.jpeg", "/images/gallery/maharaj/img11.jpeg",
      "/images/gallery/maharaj/img12.jpeg", "/images/gallery/maharaj/img13.jpeg",
      "/images/gallery/maharaj/img14.jpeg", "/images/gallery/maharaj/img15.jpeg",
      "/images/gallery/maharaj/img16.jpeg", "/images/gallery/maharaj/img17.jpeg",
      "/images/gallery/maharaj/img18.jpeg"
    ],

    "Motivational Thoughts": [
      // 🟡 Column 1
      "/images/gallery/thoughts/1.jpg", "/images/gallery/thoughts/2.jpg", "/images/gallery/thoughts/3.jpg",
      "/images/gallery/thoughts/4.jpg", "/images/gallery/thoughts/5.jpg", "/images/gallery/thoughts/6.jpg",
      "/images/gallery/thoughts/7.jpg", "/images/gallery/thoughts/8.jpg", "/images/gallery/thoughts/9.jpg",
      "/images/gallery/thoughts/10.jpg", "/images/gallery/thoughts/11.jpg", "/images/gallery/thoughts/12.jpg",
      "/images/gallery/thoughts/13.jpg", "/images/gallery/thoughts/14.jpg", "/images/gallery/thoughts/15.jpg",
      "/images/gallery/thoughts/16.jpg", "/images/gallery/thoughts/17.jpg", "/images/gallery/thoughts/18.jpg",
      "/images/gallery/thoughts/19.jpg", "/images/gallery/thoughts/20.jpg", "/images/gallery/thoughts/21.jpg",
      "/images/gallery/thoughts/22.jpg", "/images/gallery/thoughts/23.jpg", "/images/gallery/thoughts/24.jpg",
      "/images/gallery/thoughts/25.jpg", "/images/gallery/thoughts/26.jpg", "/images/gallery/thoughts/27.jpg",
      "/images/gallery/thoughts/28.jpg", "/images/gallery/thoughts/29.jpg", "/images/gallery/thoughts/30.jpg",

      // 🟢 Column 2
      "/images/gallery/thoughts/31.jpg", "/images/gallery/thoughts/32.jpg", "/images/gallery/thoughts/33.jpg",
      "/images/gallery/thoughts/34.jpg", "/images/gallery/thoughts/35.jpg", "/images/gallery/thoughts/36.jpg",
      "/images/gallery/thoughts/37.jpg", "/images/gallery/thoughts/38.jpg", "/images/gallery/thoughts/39.jpg",
      "/images/gallery/thoughts/40.jpg", "/images/gallery/thoughts/41.jpg", "/images/gallery/thoughts/42.jpg",
      "/images/gallery/thoughts/43.jpg", "/images/gallery/thoughts/44.jpg", "/images/gallery/thoughts/45.jpg",
      "/images/gallery/thoughts/46.jpg", "/images/gallery/thoughts/47.jpg", "/images/gallery/thoughts/48.jpg",
      "/images/gallery/thoughts/49.jpg", "/images/gallery/thoughts/50.jpg", "/images/gallery/thoughts/51.jpg",
      "/images/gallery/thoughts/52.jpg", "/images/gallery/thoughts/53.jpg", "/images/gallery/thoughts/54.jpg",
      "/images/gallery/thoughts/55.jpg", "/images/gallery/thoughts/56.jpg", "/images/gallery/thoughts/57.jpg",
      "/images/gallery/thoughts/58.jpg", "/images/gallery/thoughts/59.jpg", "/images/gallery/thoughts/60.jpg",

      // 🔵 Column 3
      "/images/gallery/thoughts/61.jpg", "/images/gallery/thoughts/62.jpg", "/images/gallery/thoughts/63.jpg",
      "/images/gallery/thoughts/64.jpg", "/images/gallery/thoughts/65.jpg", "/images/gallery/thoughts/66.jpg",
      "/images/gallery/thoughts/67.jpg", "/images/gallery/thoughts/68.jpg", "/images/gallery/thoughts/69.jpg",
      "/images/gallery/thoughts/70.jpg", "/images/gallery/thoughts/71.jpg", "/images/gallery/thoughts/72.jpg",
      "/images/gallery/thoughts/73.jpg", "/images/gallery/thoughts/74.jpg", "/images/gallery/thoughts/75.jpg",
      "/images/gallery/thoughts/76.jpg", "/images/gallery/thoughts/77.jpg", "/images/gallery/thoughts/78.jpg",
      "/images/gallery/thoughts/79.jpg", "/images/gallery/thoughts/80.jpg", "/images/gallery/thoughts/81.jpg",
      "/images/gallery/thoughts/82.jpg", "/images/gallery/thoughts/83.jpg", "/images/gallery/thoughts/84.jpg",
      "/images/gallery/thoughts/85.jpg", "/images/gallery/thoughts/86.jpg", "/images/gallery/thoughts/87.png",
      "/images/gallery/thoughts/88.png", "/images/gallery/thoughts/89.png", "/images/gallery/thoughts/90.png",
      "/images/gallery/thoughts/91.png", "/images/gallery/thoughts/92.png", "/images/gallery/thoughts/93.png"
    ],

    "Jinsharnam Tirth": [
      "/images/gallery/tirth/img1.jpeg",
      "/images/gallery/tirth/img2.jpeg",
      "/images/gallery/tirth/img3.jpg",
    ],
    "Logos & Identity": [
      "/images/gallery/logo/logo.jpg",
    ],
  };

  const [activeCategory, setActiveCategory] = useState<string>("Pulak Sagar Ji");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openImage = (index: number) => {
    setSelectedImage(categories[activeCategory][index]);
    setCurrentIndex(index);
  };

  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    const total = categories[activeCategory].length;
    const newIndex = (currentIndex + 1) % total;
    setCurrentIndex(newIndex);
    setSelectedImage(categories[activeCategory][newIndex]);
  };

  const prevImage = () => {
    const total = categories[activeCategory].length;
    const newIndex = (currentIndex - 1 + total) % total;
    setCurrentIndex(newIndex);
    setSelectedImage(categories[activeCategory][newIndex]);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = selectedImage!;
    link.download = selectedImage!.split("/").pop()!;
    link.click();
  };

  return (
    <section className="relative min-h-screen py-24 bg-gradient-to-b from-[#FFF6D8] via-[#FFE8A3] to-[#FFF1D0] overflow-hidden text-center">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/swastik-pattern.png')] opacity-10 bg-cover bg-center"></div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-5xl md:text-6xl text-[#7A1A00] mb-12 drop-shadow-md relative z-10"
      >
        Gallery of Motivational Moments
      </motion.h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
        {Object.keys(categories).map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full border-2 font-medium transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#3A0A00] border-[#C45A00] shadow-lg"
                : "bg-white/70 text-[#4B1E00] border-[#ECA400]/40 hover:bg-[#FFF0C2]"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 relative z-10"
      >
        {categories[activeCategory].map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            onClick={() => openImage(i)}
            className="relative group overflow-hidden rounded-2xl border-[2px] border-[#FBBF24]/40 shadow-[0_0_25px_-10px_rgba(196,90,0,0.3)] hover:shadow-[0_0_40px_-10px_rgba(255,191,36,0.5)] cursor-pointer bg-[#FFFDF5]"
          >
            <Image
              src={src}
              alt={`${activeCategory} ${i + 1}`}
              width={350}
              height={250}
              className="object-cover w-full h-[160px] md:h-[180px] lg:h-[200px] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3A0A00]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-2">
              <p className="text-white text-xs tracking-wide">{activeCategory}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>    

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full bg-[#FFFDF5]/10 backdrop-blur-md rounded-3xl border border-[#FFD97A]/40 shadow-[0_0_40px_rgba(255,217,122,0.4)] overflow-hidden"
            >
              <Image
                src={selectedImage}
                alt="Selected image"
                width={1200}
                height={800}
                className="object-contain w-full h-[75vh]"
              />

              {/* Controls */}
              <div className="absolute top-4 right-4 flex space-x-3">
                <button
                  onClick={downloadImage}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
                  title="Download Image"
                >
                  <Download className="text-white w-5 h-5" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
                  title="Close"
                >
                  <X className="text-white w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/40 transition"
              >
                <ChevronLeft className="text-white w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/40 transition"
              >
                <ChevronRight className="text-white w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
