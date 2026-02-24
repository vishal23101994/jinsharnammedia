"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {

  const [activeCategory, setActiveCategory] = useState<string>("Pulak Sagar Ji");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [images, setImages] = useState<string[]>([]);

  const categories = [
    "Pulak Sagar Ji",
    "Motivational Thoughts",
    "Jinsharnam Tirth",
    "Vatsalya Dhara Trust",
    "Logos & Identity",
  ];

  useEffect(() => {
    const folderMap: Record<string, string> = {
      "Pulak Sagar Ji": "maharaj",
      "Motivational Thoughts": "thoughts",
      "Jinsharnam Tirth": "tirth",
      "Vatsalya Dhara Trust": "vatsalya",
      "Logos & Identity": "logo",
    };

    const folder = folderMap[activeCategory];

    fetch(`/api/gallery/${folder}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error("Gallery API returned invalid data:", data);
          setImages([]); // prevent crash
        }
      })
      .catch((err) => {
        console.error("Gallery fetch error:", err);
        setImages([]);
      });

  }, [activeCategory]);


  const openImage = (index: number) => {
    setSelectedImage(images[index]);
    setCurrentIndex(index);
  };

  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    const total = images.length;
    const newIndex = (currentIndex + 1) % total;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const total = images.length;
    const newIndex = (currentIndex - 1 + total) % total;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = selectedImage!;
    link.download = selectedImage!.split("/").pop()!;
    link.click();
  };

  return (
    <section className="relative min-h-screen py-24 bg-gradient-to-b from-[#FFF6D8] via-[#FFE8A3] to-[#FFF1D0] overflow-hidden text-center">
      
      <div className="absolute inset-0 bg-[url('/swastik-pattern.png')] opacity-10 bg-cover bg-center" />

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
        {categories.map((cat) => (
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

      {/* Image grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 relative z-10"
      >
        {Array.isArray(images) && images.map((src, i) => (
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
                >
                  <Download className="text-white w-5 h-5" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
                >
                  <X className="text-white w-5 h-5" />
                </button>
              </div>

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
