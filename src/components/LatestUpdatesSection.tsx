"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

/* ================= TYPES ================= */

type Category = "JINSHARNAM" | "VATSALYA" | "ADVERTISEMENT";

type Update = {
  id: string;
  title: string;
  imageUrl?: string;
  category: Category;
};

const SECTIONS = [
  { key: "JINSHARNAM", title: "Shri Digambar Jain Jinsharnam Tirth Trust" },
  { key: "VATSALYA", title: "Vatsalya Dhara Trust" },
  { key: "ADVERTISEMENT", title: "Pulak Manch Parivar" },
] as const;

/* ================= MAIN ================= */

export default function LatestUpdatesSection() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [updates, setUpdates] = useState<Update[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const touchStartX = useRef<number | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch("/api/latest-update")
      .then((r) => r.json())
      .then((j) => setUpdates(j.data || []));
  }, []);

  /* Reset carousel on open */
  useEffect(() => {
    if (activeCategory) setIndex(0);
  }, [activeCategory]);

  /* Lock background scroll */
  useEffect(() => {
    document.body.style.overflow = activeCategory ? "hidden" : "";
  }, [activeCategory]);

  const latestByCategory = (cat: Category) =>
    updates
      .filter((u) => u.category === cat)
      .sort((a, b) => (a.id < b.id ? 1 : -1))[0];

  const filtered = updates.filter((u) => u.category === activeCategory);
  const maxIndex = Math.max(filtered.length - 3, 0);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  /* Auto slide */
  useEffect(() => {
    if (!activeCategory || isHovering || filtered.length <= 3) return;
    const t = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      4500
    );
    return () => clearInterval(t);
  }, [activeCategory, filtered.length, isHovering]);

  return (
    <>
      {/* ================= HOME ================= */}
      <section className="py-28 bg-[#FFF7E1]">
        <h2 className="text-4xl font-serif text-center text-[#4B1E00]">
          Latest Updates
        </h2>

        <div className="mt-6 mb-20 text-center italic text-[#4B1E00]/80 space-y-2">
          <p>Moments of Seva, Sadhana & Spiritual Growth</p>
          <p>Reflections from Shri Digambar Jain Jinsharnam Tirth Trust, Vatsalya Dhara Trust & Pulak Manch Parivar</p>
          <p>Walking together on the path of Dharma</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 px-6">
          {SECTIONS.map((s) => {
            const latest = latestByCategory(s.key);

            return (
              <motion.div
                key={s.key}
                whileHover={{ y: -10 }}
                className="
                  rounded-[2.8rem] p-[3px]
                  bg-gradient-to-br from-[#C99A2C] via-[#FFE6A3] to-[#B8821E]
                  shadow-[0_35px_90px_rgba(201,140,43,0.55)]
                "
              >
                <div className="
                  rounded-[2.4rem] p-6
                  bg-[radial-gradient(circle_at_top,#FFFDF6,#FFF1CF)]
                  border border-[#E6C670]
                ">
                  {/* IMAGE PREVIEW */}
                  <div className="h-64 flex items-center justify-center mb-5">
                    {latest?.imageUrl ? (
                      <img
                        src={latest.imageUrl}
                        alt={latest.title}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-serif text-[#4B1E00]">
                        {s.title}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg text-[#4B1E00] mb-2">
                    {s.title}
                  </h3>

                  {s.key === "ADVERTISEMENT" ? (
                    <button
                      onClick={() => setActiveCategory("ADVERTISEMENT")}
                      className="font-semibold underline text-sm"
                    >
                      View Pulak Manch Parivar Updates →
                    </button>
                  ) : latest ? (
                    <>
                      <p className="text-sm font-semibold mb-3">
                        {latest.title}
                      </p>
                      <button
                        onClick={() => setActiveCategory(s.key)}
                        className="font-semibold underline text-sm"
                      >
                        View all updates →
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No updates yet.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#3A1A00]/85 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-[#FFF7E1] rounded-3xl w-[95vw] max-w-7xl p-10 relative overflow-hidden">
              <button
                onClick={() => setActiveCategory(null)}
                className="absolute top-4 right-4 text-xl font-bold"
              >
                ✕
              </button>

              <h3 className="text-3xl font-serif text-center text-[#4B1E00] mb-14">
                {SECTIONS.find((s) => s.key === activeCategory)?.title}
              </h3>

              <div
                className="relative overflow-hidden px-16"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={(e) =>
                  (touchStartX.current = e.touches[0].clientX)
                }
                onTouchEnd={(e) => {
                  if (touchStartX.current === null) return;
                  const diff =
                    touchStartX.current - e.changedTouches[0].clientX;
                  if (diff > 60) next();
                  if (diff < -60) prev();
                  touchStartX.current = null;
                }}
              >
                {/* LEFT */}
                <Arrow direction="left" onClick={prev} disabled={index === 0} />

                {/* SLIDER */}
                <motion.div
                  className="flex gap-12"
                  animate={{ x: -index * 320 }}
                  transition={{ type: "spring", stiffness: 80, damping: 22 }}
                >
                  {filtered.map((u) => (
                    <motion.div
                      key={u.id}
                      className="
                        relative min-w-[280px]
                        rounded-[2.8rem] p-[3px]
                        bg-gradient-to-br from-[#C99A2C] via-[#FFE6A3] to-[#B8821E]
                      "
                    >
                      <div className="
                        rounded-[2.4rem] p-6
                        bg-[radial-gradient(circle_at_top,#FFFDF6,#FFF1CF)]
                        border border-[#E6C670]
                      ">
                        {/* ADMIN */}
                        {isAdmin && (
                          <div className="absolute top-4 left-4 z-20 flex gap-2 bg-white/90 rounded px-2 py-1">
                            <Link
                              href={`/admin/updates/${u.id}`}
                              className="text-xs font-semibold text-blue-700"
                            >
                              Edit
                            </Link>
                            <button
                              className="text-xs font-semibold text-red-600"
                              onClick={async () => {
                                if (!confirm("Delete this update?")) return;
                                await fetch(`/api/admin/updates/${u.id}`, {
                                  method: "DELETE",
                                });
                                setUpdates((p) =>
                                  p.filter((x) => x.id !== u.id)
                                );
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}

                        <div
                          className="h-60 flex items-center justify-center cursor-zoom-in"
                          onClick={() => setZoomImage(u.imageUrl || null)}
                        >
                          {u.imageUrl && (
                            <img
                              src={u.imageUrl}
                              alt={u.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          )}
                        </div>

                        <div className="mt-4 text-center font-semibold">
                          {u.title}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* RIGHT */}
                <Arrow
                  direction="right"
                  onClick={next}
                  disabled={index >= maxIndex}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= ZOOM ================= */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center"
            onClick={() => setZoomImage(null)}
          >
            <motion.img
              src={zoomImage}
              className="max-h-[92vh] max-w-[92vw] rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= ARROW ================= */

function Arrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        absolute ${direction === "left" ? "left-2" : "right-2"}
        top-1/2 -translate-y-1/2 z-20
        w-12 h-12 rounded-full
        flex items-center justify-center
        bg-gradient-to-br from-[#FFE6A3] to-[#C99A2C]
        shadow-lg text-2xl font-bold
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}
