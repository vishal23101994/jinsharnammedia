"use client";

import { useAudioPlayer } from "@/app/providers/AudioPlayerProvider";
import { Play, Pause } from "lucide-react";

export default function GlobalMiniPlayer() {
  const { currentTrack, isPlaying, toggle } = useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2
      bg-gradient-to-r from-[#FDE68A] to-[#F59E0B]
      px-6 py-3 rounded-full shadow-lg z-50 flex gap-4 items-center">
      
      <div className="truncate max-w-[220px] font-medium text-[#4B1E00]">
        {currentTrack.title}
      </div>

      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
    </div>
  );
}
