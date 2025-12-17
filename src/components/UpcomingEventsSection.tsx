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
  const [index, setIndex] = useState(0);
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

  const prev = () =>
    setIndex((i) => (i === 0 ? events.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === events.length - 1 ? 0 : i + 1));

  return (
    <>
      <section className="relative py-28 bg-gradient-to-b from-[#FFF8E7] to-white overflow-hidden">
        <h2 className="text-4xl font-serif text-center text-[#4B1E00] mb-16">
          Upcoming Events
        </h2>

        <ArrowButton side="left" onClick={prev} />
        <ArrowButton side="right" onClick={next} />

        <div className="relative flex justify-center items-center h-[560px]">
          {events.map((e, i) => {
            const offset = i - index;
            if (Math.abs(offset) > 2) return null;

            const isCenter = offset === 0;
            const eventDate = new Date(e.eventDate);

            return (
              <motion.div
                key={e.id}
                animate={{
                  x: offset * 340,
                  scale: isCenter ? 1 : 0.78,
                  opacity: isCenter ? 1 : 0.35,
                  filter: isCenter ? "blur(0px)" : "blur(4px)",
                  zIndex: isCenter ? 20 : 1,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute w-[320px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-[#FFD97A]/40"
              >
                {/* ✨ Spiritual glow */}
                {isCenter && (
                  <div className="absolute -inset-4 bg-[#FFD97A]/30 blur-3xl rounded-full -z-10" />
                )}

                {/* Event Image */}
                {e.imageUrl && (
                  <img
                    src={e.imageUrl}
                    onClick={() => isCenter && setActiveImage(e.imageUrl!)}
                    className="w-full h-[360px] object-cover cursor-zoom-in"
                  />
                )}

                {/* 📅 Date Badge */}
                <div className="absolute top-4 left-4 bg-[#4B1E00] text-white rounded-xl px-3 py-1 text-xs shadow">
                  {eventDate.toDateString()}
                </div>

                {/* Admin controls (NOT on image) */}
                {isCenter && isAdmin && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <AdminButton
                      label="✏️"
                      href={`/admin/events/${e.id}`}
                    />
                    <AdminDeleteButton
                      endpoint={`/api/admin/events/${e.id}`}
                    />
                  </div>
                )}

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
              </motion.div>
            );
          })}
        </div>
      </section>

      <ImageModal src={activeImage} onClose={() => setActiveImage(null)} />
    </>
  );
}

/* ---------------- REUSABLE UI ---------------- */

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
      } top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full 
      bg-[#FFD97A] text-[#4B1E00] shadow-xl 
      hover:scale-110 transition`}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}

function AdminButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="h-9 w-9 bg-[#FFD97A] rounded-full flex items-center justify-center shadow hover:scale-110 transition"
    >
      {label}
    </a>
  );
}

function AdminDeleteButton({ endpoint }: { endpoint: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Delete this event?")) return;
        await fetch(endpoint, { method: "DELETE" });
        location.reload();
      }}
      className="h-9 w-9 bg-red-500 text-white rounded-full shadow hover:scale-110 transition"
    >
      🗑
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
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
