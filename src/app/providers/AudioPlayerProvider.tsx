"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { audios } from "@/data/audio";

type Track = {
  title: string;
  artist?: string;
  src: string;
};

type AudioContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isOpen: boolean;

  playByIndex: (index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  shuffleToggle: () => void;
  seek: (time: number) => void;
  closePlayer: () => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playlist] = useState<Track[]>(audios);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /* ---------- Core ---------- */
  const loadTrack = async (index: number) => {
    const track = playlist[index];
    if (!track) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    // ✅ STOP current playback safely
    audio.pause();
    audio.currentTime = 0;

    // ✅ CHANGE SOURCE
    audio.src = track.src;
    audio.load();

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    audio.onended = () => {
      next();
    };

    try {
      await audio.play(); // ✅ SAFE play
      setIsPlaying(true);
    } catch (err) {
      // 🔕 Ignore AbortError safely
      console.warn("Audio play interrupted (safe to ignore)");
    }

    setCurrentIndex(index);
    setCurrentTrack(track);
    setIsOpen(true);
  };


  /* ---------- Controls ---------- */
  const playByIndex = (index: number) => loadTrack(index);

  const toggle = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const next = () => {
    const nextIndex = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex + 1) % playlist.length;

    loadTrack(nextIndex);
  };

  const prev = () => {
    const prevIndex =
      (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
  };

  const shuffleToggle = () => setShuffle((s) => !s);

  const seek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const closePlayer = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsOpen(false);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        isOpen,
        playByIndex,
        toggle,
        next,
        prev,
        shuffleToggle,
        seek,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudioPlayer = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within provider");
  return ctx;
};
