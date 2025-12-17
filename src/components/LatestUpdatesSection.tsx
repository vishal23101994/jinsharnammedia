"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Update = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
};

export default function LatestUpdatesSection() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [updates, setUpdates] = useState<Update[]>([]);
  const [index, setIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/latest-updates")
      .then((r) => r.json())
      .then((j) => setUpdates(j.data || []));
  }, []);

  if (updates.length === 0) return null;

  const prev = () =>
    setIndex((i) => (i === 0 ? updates.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === updates.length - 1 ? 0 : i + 1));

  return (
    <>
      <section className="relative py-28 bg-gradient-to-b from-[#FFF3D6] via-[#FFF8E7] to-white overflow-hidden">
        <h2 className="text-4xl font-serif text-center text-[#4B1E00] mb-16">
          Latest Updates
        </h2>

        {/* Arrows */}
        <ArrowButton side="left" onClick={prev} />
        <ArrowButton side="right" onClick={next} />

        {/* Carousel */}
        <div className="relative flex justify-center items-center h-[540px]">
          {updates.map((u, i) => {
            const offset = i - index;
            if (Math.abs(offset) > 2) return null;

            const isCenter = offset === 0;

            return (
              <motion.div
                key={u.id}
                animate={{
                  x: offset * 330,
                  scale: isCenter ? 1 : 0.78,
                  opacity: isCenter ? 1 : 0.35,
                  filter: isCenter ? "blur(0px)" : "blur(4px)",
                  zIndex: isCenter ? 20 : 1,
                }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute w-[300px] bg-white rounded-3xl shadow-2xl border border-[#FFD97A]/40 overflow-hidden"
              >
                {/* Aura */}
                {isCenter && (
                  <div className="absolute -inset-6 bg-[#FFD97A]/30 blur-3xl rounded-full -z-10" />
                )}

                {/* Image */}
                {u.imageUrl && (
                  <img
                    src={u.imageUrl}
                    onClick={() => {
                      if (isCenter && u.imageUrl) {
                        setActiveImage(u.imageUrl);
                      }
                    }}
                    className="w-full h-[360px] object-cover cursor-zoom-in"
                    alt={u.title}
                  />
                )}

                {/* Admin actions (NOT on image) */}
                {isCenter && isAdmin && (
                  <div className="absolute top-3 left-3 flex gap-2 bg-white/90 backdrop-blur px-2 py-1 rounded-xl shadow">
                    <Link
                      href={`/admin/updates/${u.id}`}
                      className="text-xs font-semibold text-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this update?")) return;
                        await fetch(`/api/admin/updates/${u.id}`, {
                          method: "DELETE",
                        });
                        location.reload();
                      }}
                      className="text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-[#4B1E00] line-clamp-1">
                    {u.title}
                  </h3>
                  <p className="text-sm text-[#4B1E00]/80 line-clamp-2">
                    {u.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <ImageModal src={activeImage} onClose={() => setActiveImage(null)} />
    </>
  );
}

/* ---------- Shared Components ---------- */

function ArrowButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute ${
        side === "left" ? "left-10" : "right-10"
      } top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-[#FFD97A] text-[#4B1E00] shadow-xl hover:scale-110 transition`}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}

function ImageModal({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) {
  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.img
          src={src}
          className="max-h-[75vh] max-w-[80vw] rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
