"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

type Event = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  eventDate: string;
  imageUrl?: string | null;
};

export default function UpcomingEventsSection() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [events, setEvents] = useState<Event[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((j) => setEvents(j.data || []));
  }, []);

  // ESC closes image modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) =>
      e.key === "Escape" && setActiveImage(null);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (events.length === 0) return null;

  return (
    <>
      <section className="relative py-28 bg-gradient-to-b from-[#FFF8E7] to-white overflow-hidden">
        <h2 className="text-4xl font-serif text-center text-[#4B1E00] mb-16">
          Upcoming Events
        </h2>

        {/* AUTO SCROLLING ROW */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-10 w-max px-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...Array(2)].map((_, loopIndex) =>
              events.map((e) => {
                const eventDate = new Date(e.eventDate);

                return (
                  <div
                    key={`${loopIndex}-${e.id}`}
                    className="relative w-[320px]
                               rounded-3xl overflow-hidden
                               bg-white shadow-xl
                               border border-[#FFD97A]/40
                               shrink-0"
                  >
                    {/* EVENT IMAGE WITH HOVER ZOOM */}
                    {e.imageUrl && (
                      <div className="relative overflow-hidden group">
                        <img
                          src={e.imageUrl}
                          onClick={() => setActiveImage(e.imageUrl!)}
                          alt={e.title}
                          className="
                            w-full h-[360px] object-cover
                            cursor-zoom-in
                            transition-transform duration-500 ease-out
                            group-hover:scale-110
                          "
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                      </div>
                    )}

                    {/* DATE BADGE */}
                    <div className="absolute top-4 left-4 bg-[#4B1E00] text-white rounded-xl px-3 py-1 text-xs shadow">
                      {eventDate.toDateString()}
                    </div>

                    {/* ADMIN CONTROLS */}
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex gap-2 bg-white/90 px-2 py-1 rounded-xl shadow">
                        <a
                          href={`/admin/events/${e.id}`}
                          className="text-xs font-semibold text-blue-700"
                        >
                          Edit
                        </a>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this event?")) return;
                            await fetch(`/api/admin/events/${e.id}`, {
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
                        {e.title}
                      </h3>

                      <p className="text-sm text-[#4B1E00]/80 line-clamp-2 mt-1">
                        {e.description}
                      </p>

                      <p className="text-sm text-[#B97A2B] mt-2">
                        📍 {e.location || "Location TBA"}
                      </p>
                    </div>
                  </div>
                );
              })
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
