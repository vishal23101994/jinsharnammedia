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
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/latest-updates")
      .then((r) => r.json())
      .then((j) => setUpdates(j.data || []));
  }, []);

  if (updates.length === 0) return null;

  return (
    <>
      <section className="relative py-28 bg-gradient-to-b from-[#FFF3D6] via-[#FFF8E7] to-white overflow-hidden">
        <h2 className="text-4xl font-serif text-center text-[#4B1E00] mb-16">
          Latest Updates
        </h2>

        {/* AUTO SCROLLING ROW */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8 w-max px-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 55,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...Array(2)].map((_, loopIndex) =>
              updates.map((u) => (
                <div
                  key={`${loopIndex}-${u.id}`}
                  className="relative w-[300px] bg-white rounded-3xl
                             shadow-xl border border-[#FFD97A]/40
                             overflow-hidden shrink-0"
                >
                  {/* IMAGE WITH HOVER ZOOM */}
                  {u.imageUrl && (
                    <div className="relative overflow-hidden group">
                      <img
                        src={u.imageUrl}
                        onClick={() => setActiveImage(u.imageUrl!)}
                        alt={u.title}
                        className="
                          w-full h-[360px] object-cover
                          cursor-zoom-in
                          transition-transform duration-500 ease-out
                          group-hover:scale-110
                        "
                      />

                      {/* subtle hover overlay (optional but recommended) */}
                      <div className="
                        pointer-events-none absolute inset-0
                        bg-black/0 group-hover:bg-black/10
                        transition
                      " />
                    </div>
                  )}


                  {/* ADMIN ACTIONS */}
                  {isAdmin && (
                    <div className="absolute top-3 left-3 flex gap-2 bg-white/90 px-2 py-1 rounded-xl shadow">
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

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-[#4B1E00] line-clamp-1">
                      {u.title}
                    </h3>
                    <p className="text-sm text-[#4B1E00]/80 line-clamp-2">
                      {u.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* IMAGE MODAL */}
      <ImageModal src={activeImage} onClose={() => setActiveImage(null)} />
    </>
  );
}

/* ---------- IMAGE MODAL ---------- */

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
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.img
          src={src}
          className="max-h-[75vh] max-w-[85vw] rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.92 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
