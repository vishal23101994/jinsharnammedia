"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Play, Pause, Download, SkipBack, SkipForward,
  RotateCcw, RotateCw, Search, Repeat
} from "lucide-react";
import { audios } from "@/data/audio.ts"; // <- make sure this file exists

type Track = {
  title: string;
  artist?: string;
  album?: string;
  src: string;
};

export default function AudioPage() {
  // --- player state
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // --- derived data
  const filtered: Track[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return audios;
    return audios.filter(t =>
      [t.title, t.artist ?? "", t.album ?? ""]
        .join(" | ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const currentTrack = currentIndex !== null ? filtered[currentIndex] : null;

  // --- audio wire-up
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const onLoaded = () => {
      setDuration(audio.duration || 0);
    };
    const onEnded = () => {
      if (loop) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
        return;
      }
      playNext();
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop]);

  // when list changes (search), keep playing if possible
  useEffect(() => {
    if (currentIndex === null) return;
    if (currentIndex > filtered.length - 1) {
      setCurrentIndex(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [filtered.length, currentIndex]);

  // auto-scroll active row into view
  useEffect(() => {
    if (currentIndex === null) return;
    const el = rowRefs.current[currentIndex];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex]);

  // --- helpers
  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const playAtIndex = (idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    // same index toggles play/pause
    if (currentIndex === idx) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    // start a new track
    audio.src = filtered[idx].src;
    audio.play();
    setCurrentIndex(idx);
    setIsPlaying(true);
  };

  const playNext = () => {
    if (filtered.length === 0) return;
    if (currentIndex === null) {
      playAtIndex(0);
      return;
    }
    const next = (currentIndex + 1) % filtered.length;
    playAtIndex(next);
  };

  const playPrev = () => {
    if (filtered.length === 0) return;
    if (currentIndex === null) {
      playAtIndex(0);
      return;
    }
    const prev = (currentIndex - 1 + filtered.length) % filtered.length;
    playAtIndex(prev);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(0, (audio.currentTime || 0) + seconds), duration || 0);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const pct = Number(e.target.value);
    const newTime = (pct / 100) * (duration || 0);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const onDownload = (track: Track) => {
    const a = document.createElement("a");
    a.href = track.src;
    // keep original extension from path
    const parts = track.src.split("/");
    a.download = parts[parts.length - 1];
    a.click();
  };

  return (
    <section className="relative min-h-screen px-4 pt-20 pb-40 bg-gradient-to-b from-[#FFF9E6] via-[#FFE7A1] to-[#FFF1D0] overflow-hidden">
      {/* soft ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 w-[34rem] h-[34rem] rounded-full bg-[#FFE8A3]/40 blur-3xl" />
        <div className="absolute bottom-10 right-0 w-[28rem] h-[28rem] rounded-full bg-[#FFD580]/40 blur-3xl" />
      </div>

      {/* heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center font-serif text-5xl md:text-6xl text-[#7A1A00] drop-shadow-sm"
      >
        Jinsharnam Audio Library
      </motion.h1>

      {/* search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="relative z-10 max-w-3xl mx-auto mt-8"
      >
        <div className="flex items-center gap-3 rounded-full bg-white/70 backdrop-blur border border-[#FFD97A]/60 px-4 py-2 shadow-md focus-within:ring-2 focus-within:ring-amber-400/50 transition">
          <Search className="w-5 h-5 text-[#C45A00]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bhajan, pravachan, aarti…"
            className="w-full bg-transparent outline-none text-[#3A0A00] placeholder-[#8B4513]/50"
          />
        </div>
      </motion.div>

      {/* list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 max-w-5xl mx-auto mt-8 rounded-3xl overflow-hidden border border-[#FFD97A]/60 bg-white/40 backdrop-blur-xl shadow-[0_0_30px_rgba(255,191,36,0.35)]"
      >
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-[#8B4513]">No audio found.</p>
        ) : (
          <ul className="divide-y divide-[#FAD889]/60">
            {filtered.map((t, i) => {
              const active = currentIndex === i;
              return (
                <motion.li
                  key={`${t.src}-${i}`}
                  ref={(el) => (rowRefs.current[i] = el)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
                  transition={{ duration: 0.35, delay: i * 0.01 }}
                  className={`group flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 cursor-pointer transition-colors ${
                    active ? "bg-[#FFF0C2]/60" : "hover:bg-[#FFF7DA]/60"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        active
                          ? "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white shadow"
                          : "bg-white text-[#5A2B00] border border-[#FFD97A]/60"
                      }`}
                    >
                      {i + 1}
                    </div>

                    <div className="min-w-0">
                      <div
                        className={`truncate font-semibold ${
                          active
                            ? "text-[#8B0000]"
                            : "text-[#3A0A00] group-hover:text-[#8B0000]"
                        }`}
                      >
                        {t.title}
                      </div>
                      {(t.artist || t.album) && (
                        <div className="truncate text-xs text-[#6B3E00]/70">
                          {t.artist || "Jinsharnam Media"}
                          {t.album ? ` • ${t.album}` : ""}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAtIndex(i);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white shadow-md hover:scale-110 transition"
                      title={active && isPlaying ? "Pause" : "Play"}
                    >
                      {active && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(t);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#C45A00] border border-[#FFD97A]/60 hover:bg-[#FFF2CC] transition"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>

      {/* global audio */}
      <audio ref={audioRef} />

      {/* floating mini-player (raised so it won't overlap your back-to-top) */}
      {currentTrack && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="fixed left-1/2 -translate-x-1/2 bottom-8 w-[95%] sm:w-[82%] md:w-[64%] xl:w-[900px] z-40"
        >
          <div className="rounded-2xl bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#F59E0B] text-[#3A0A00] shadow-[0_8px_30px_rgba(196,90,0,0.35)] border border-[#FFD97A]/60">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">
              {/* now playing */}
              <div className="min-w-0 w-[40%]">
                <div className="truncate font-semibold">
                  {currentTrack.title}
                </div>
                <div className="truncate text-xs text-[#5A2B00]/70">
                  {currentTrack.artist || "Jinsharnam Media"}
                </div>
              </div>

              {/* controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setLoop(v => !v)}
                  className={`p-2 rounded-full transition ${
                    loop ? "bg-white/40" : "hover:bg-white/30"
                  }`}
                  title={loop ? "Loop: On" : "Loop: Off"}
                >
                  <Repeat className={`w-5 h-5 ${loop ? "text-[#8B0000]" : ""}`} />
                </button>

                <button
                  onClick={playPrev}
                  className="p-2 rounded-full hover:bg-white/30 transition"
                  title="Previous"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => skip(-10)}
                  className="p-2 rounded-full hover:bg-white/30 transition"
                  title="Back 10s"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    if (currentIndex === null) return;
                    playAtIndex(currentIndex);
                  }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-[#C45A00] border border-[#FFD97A]/60 shadow-md hover:scale-110 transition"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => skip(10)}
                  className="p-2 rounded-full hover:bg-white/30 transition"
                  title="Forward 10s"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                <button
                  onClick={playNext}
                  className="p-2 rounded-full hover:bg-white/30 transition"
                  title="Next"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* time + seek */}
              <div className="hidden md:flex items-center gap-3 w-[35%]">
                <span className="text-xs tabular-nums">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={duration ? Math.min(100, (currentTime / duration) * 100) : 0}
                  onChange={onSeek}
                  className="w-full accent-[#8B0000]"
                />
                <span className="text-xs tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>

            {/* mobile seek */}
            <div className="md:hidden px-4 pb-3 -mt-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] tabular-nums">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={duration ? Math.min(100, (currentTime / duration) * 100) : 0}
                  onChange={onSeek}
                  className="w-full accent-[#8B0000]"
                />
                <span className="text-[11px] tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* bottom spacer so floating bar doesn't overlap page content or your back-to-top */}
      <div className="h-24" />
    </section>
  );
}
