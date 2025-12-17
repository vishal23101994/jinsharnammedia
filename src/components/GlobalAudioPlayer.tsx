"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  X,
} from "lucide-react";
import { useAudioPlayer } from "@/app/providers/AudioPlayerProvider";

export default function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    next,
    prev,
    shuffle,
    currentTime,
    duration,
    seek,
    isOpen,
    closePlayer,
  } = useAudioPlayer();

  if (!currentTrack || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-[9999] w-[360px]"
      >
        <div className="rounded-xl bg-[#FFF7DA] border border-[#E6C670] shadow-lg px-4 py-3">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#4B1E00] truncate">
                {currentTrack.title}
              </p>
              <p className="text-[11px] text-[#6B3E00]/70 truncate">
                {currentTrack.artist || "Jinsharnam Media"}
              </p>
            </div>

            <button
              onClick={closePlayer}
              className="p-1 rounded-full hover:bg-[#F3E6B5]"
              title="Stop & Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full mt-2 accent-[#8B0000]"
          />

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <button onClick={shuffle} title="Shuffle">
              <Shuffle size={18} />
            </button>

            <button onClick={prev} title="Previous">
              <SkipBack size={20} />
            </button>

            <button
              onClick={toggle}
              className="w-10 h-10 rounded-full bg-[#F5B301] text-[#4B1E00] flex items-center justify-center"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button onClick={next} title="Next">
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
