"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  X,
  Music,
} from "lucide-react";
import { useState } from "react";
import { useAudioPlayer } from "@/app/providers/AudioPlayerProvider";

export default function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    next,
    prev,
    shuffleToggle,
    currentTime,
    duration,
    seek,
    isOpen,
    closePlayer,
  } = useAudioPlayer();

  const [isShuffleOn, setIsShuffleOn] = useState(false);

  if (!currentTrack || !isOpen) return null;

  const handleShuffle = () => {
    setIsShuffleOn((prev) => !prev);
    shuffleToggle();
  };

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.15}
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-4 right-4 z-[9999] w-[360px] cursor-grab active:cursor-grabbing"
      >
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-gradient-to-br from-[#FFF3C4] via-[#FFE39A] to-[#FFD36A]
                     border border-[#E6C670] shadow-2xl px-4 py-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-md">
                <Music size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#4B1E00] truncate">
                  {currentTrack.title}
                </p>
                <p className="text-[11px] text-[#6B3E00]/70 truncate">
                  {currentTrack.artist || "Jinsharnam Media"}
                </p>
              </div>
            </div>

            <button
              onClick={closePlayer}
              className="p-1.5 rounded-full hover:bg-white/60 transition"
              title="Close Player"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <motion.input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full accent-[#8B0000] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Time */}
          <div className="flex justify-between text-[10px] text-[#6B3E00]/70 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mt-4">
            <button
              onClick={handleShuffle}
              title="Shuffle"
              className={`p-2 rounded-full transition ${
                isShuffleOn
                  ? "bg-[#8B0000] text-white shadow-md"
                  : "hover:bg-white/60"
              }`}
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={prev}
              title="Previous"
              className="p-2 rounded-full hover:bg-white/60 transition"
            >
              <SkipBack size={20} />
            </button>

            <motion.button
              onClick={toggle}
              whileTap={{ scale: 0.85 }}
              className="w-12 h-12 rounded-full bg-[#F5B301] text-[#4B1E00]
                         flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>

            <button
              onClick={next}
              title="Next"
              className="p-2 rounded-full hover:bg-white/60 transition"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* -------------------- Helpers -------------------- */
function formatTime(seconds: number) {
  if (!seconds && seconds !== 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
