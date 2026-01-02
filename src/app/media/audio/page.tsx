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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { setQueueAndPlay } = useAudioPlayer();

  const {
    playByIndex,
    toggle,
    currentTrack,
    isPlaying,
    next,
    prev,
  } = useAudioPlayer();

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

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
    playByIndex(audios.findIndex(a => a.src === filtered[idx].src));
  };

  const toggleSelect = (src: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(src) ? next.delete(src) : next.add(src);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelected(new Set(filtered.map(t => t.src)));
  };

  const clearSelection = () => setSelected(new Set());

  const onDownload = (track: Track) => {
    const a = document.createElement("a");
    a.href = track.src;
    a.download = track.src.split("/").pop() || "audio.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const bulkDownload = async () => {
    for (const src of selected) {
      const a = document.createElement("a");
      a.href = src;
      a.download = src.split("/").pop() || "audio.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // browser-safe delay
      await new Promise(r => setTimeout(r, 300));
    }
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <section className="relative min-h-screen px-4 pt-20 pb-40 bg-gradient-to-b from-[#FFF9E6] via-[#FFE7A1] to-[#FFF1D0]">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-serif text-5xl text-[#7A1A00]"
      >
        Jinsharnam Audio Library
      </motion.h1>

      {/* Search */}
      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex items-center gap-3 rounded-full bg-white/70 border px-4 py-2">
          <Search className="w-5 h-5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bhajan, pravachan, aarti…"
            className="w-full bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="max-w-5xl mx-auto mt-6 flex flex-wrap items-center justify-between gap-3 bg-white/80 border px-4 py-3 rounded-xl shadow">
          <span className="font-semibold">{selected.size} selected</span>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={selectAllFiltered}
              className="px-3 py-1 bg-amber-100 rounded-full text-sm"
            >
              Select All
            </button>

            <button
              onClick={clearSelection}
              className="px-3 py-1 bg-amber-50 rounded-full text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const tracks = filtered.filter(t => selected.has(t.src));
                setQueueAndPlay(tracks, 0);
                clearSelection();
              }}
              className="px-3 py-1 bg-amber-200 rounded-full text-sm"
            >
              Play Selected
            </button>

            <button
              onClick={bulkDownload}
              className="px-3 py-1 bg-orange-400 text-white rounded-full text-sm"
            >
              Download Selected
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="max-w-5xl mx-auto mt-6 rounded-3xl overflow-hidden border bg-white/40">
        <ul className="divide-y">
          {filtered.map((t, i) => {
            const active = currentTrack?.src === t.src;
            const isSelected = selected.has(t.src);

            return (
              <li
                key={t.src}
                className={`flex items-center justify-between px-6 py-4 ${
                  isSelected
                    ? "bg-[#FFE7A1]"
                    : active
                    ? "bg-[#FFF0C2]"
                    : "hover:bg-[#FFF7DA]"
                }`}
                onTouchStart={() => {
                  longPressTimer.current = setTimeout(
                    () => toggleSelect(t.src),
                    500
                  );
                }}
                onTouchEnd={() => {
                  if (longPressTimer.current)
                    clearTimeout(longPressTimer.current);
                }}
              >
                <div className="flex items-center min-w-0 gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(t.src)}
                    className="accent-amber-500"
                  />

                  <div>
                    <div className="font-semibold truncate">{t.title}</div>
                    {t.artist && (
                      <div className="text-xs opacity-70 truncate">
                        {t.artist}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => active ? toggle() : playAtIndex(i)}
                    className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center"
                  >
                    {active && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  <button
                    onClick={() => onDownload(t)}
                    className="w-9 h-9 rounded-full bg-white border flex items-center justify-center"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
