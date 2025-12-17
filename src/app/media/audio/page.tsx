"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAudioPlayer } from "@/app/providers/AudioPlayerProvider";
import {
  Play,
  Pause,
  Download,
  SkipBack,
  SkipForward,
  Search,
  Repeat,
} from "lucide-react";
import { audios } from "@/data/audio";

type Track = {
  title: string;
  artist?: string;
  src: string;
};

export default function AudioPage() {
  const [query, setQuery] = useState("");
  const [loop, setLoop] = useState(false);

  const { play, toggle, currentTrack, isPlaying } = useAudioPlayer();
  const rowRefs = useRef<Record<number, HTMLLIElement | null>>({});

  /* --------------------------------------------------
     FILTERED LIST
  -------------------------------------------------- */
  const filtered: Track[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return audios;
    return audios.filter((t) =>
      [t.title, t.artist ?? ""].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  /* --------------------------------------------------
     HELPERS
  -------------------------------------------------- */
  const playAtIndex = (idx: number) => {
    play(filtered[idx]);
  };

  const playNext = () => {
    if (!currentTrack) return playAtIndex(0);
    const idx = filtered.findIndex((t) => t.src === currentTrack.src);
    playAtIndex((idx + 1) % filtered.length);
  };

  const playPrev = () => {
    if (!currentTrack) return playAtIndex(0);
    const idx = filtered.findIndex((t) => t.src === currentTrack.src);
    playAtIndex((idx - 1 + filtered.length) % filtered.length);
  };

  const onDownload = (track: Track) => {
    const a = document.createElement("a");
    a.href = track.src;
    a.download = track.src.split("/").pop() || "audio.mp3";
    a.click();
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <section className="relative min-h-screen px-4 pt-20 pb-40 bg-gradient-to-b from-[#FFF9E6] via-[#FFE7A1] to-[#FFF1D0] overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 w-[34rem] h-[34rem] rounded-full bg-[#FFE8A3]/40 blur-3xl" />
        <div className="absolute bottom-10 right-0 w-[28rem] h-[28rem] rounded-full bg-[#FFD580]/40 blur-3xl" />
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center font-serif text-5xl md:text-6xl text-[#7A1A00]"
      >
        Jinsharnam Audio Library
      </motion.h1>

      {/* Search */}
      <div className="relative z-10 max-w-3xl mx-auto mt-8">
        <div className="flex items-center gap-3 rounded-full bg-white/70 backdrop-blur border border-[#FFD97A]/60 px-4 py-2 shadow-md">
          <Search className="w-5 h-5 text-[#C45A00]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bhajan, pravachan, aarti…"
            className="w-full bg-transparent outline-none text-[#3A0A00]"
          />
        </div>
      </div>

      {/* List */}
      <div className="relative z-10 max-w-5xl mx-auto mt-8 rounded-3xl overflow-hidden border border-[#FFD97A]/60 bg-white/40 backdrop-blur-xl shadow-lg">
        <ul className="divide-y divide-[#FAD889]/60">
          {filtered.map((t, i) => {
            const active = currentTrack?.src === t.src;

            return (
              <motion.li
                key={t.src}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center justify-between px-6 py-4 cursor-pointer ${
                  active ? "bg-[#FFF0C2]/70" : "hover:bg-[#FFF7DA]/60"
                }`}
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate text-[#3A0A00]">
                    {t.title}
                  </div>
                  {t.artist && (
                    <div className="text-xs text-[#6B3E00]/70 truncate">
                      {t.artist}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      active ? toggle() : playAtIndex(i)
                    }
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white flex items-center justify-center shadow"
                  >
                    {active && isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDownload(t)}
                    className="w-9 h-9 rounded-full bg-white border border-[#FFD97A]/60 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 text-[#C45A00]" />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Floating mini-player */}
      {currentTrack && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed left-1/2 -translate-x-1/2 bottom-8 w-[92%] md:w-[720px] z-40"
        >
          <div className="rounded-2xl bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#F59E0B] shadow-xl border border-[#FFD97A]/60 px-6 py-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-semibold truncate">
                {currentTrack.title}
              </div>
              <div className="text-xs text-[#5A2B00]/70 truncate">
                {currentTrack.artist || "Jinsharnam Media"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setLoop(!loop)}>
                <Repeat
                  className={`w-5 h-5 ${
                    loop ? "text-[#8B0000]" : ""
                  }`}
                />
              </button>

              <button onClick={playPrev}>
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={toggle}
                className="w-12 h-12 rounded-full bg-white text-[#C45A00] flex items-center justify-center shadow"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button onClick={playNext}>
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="h-24" />
    </section>
  );
}
