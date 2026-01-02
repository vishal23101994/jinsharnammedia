"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { audios as defaultAudios } from "@/data/audio";

type Track = {
  title: string;
  artist?: string;
  src: string;
};

type RepeatMode = "off" | "all" | "one";

type AudioContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isOpen: boolean;

  playByIndex: (index: number) => void;
  setQueueAndPlay: (tracks: Track[], startIndex?: number) => void;
  getQueue: () => Track[];

  toggle: () => void;
  next: () => void;
  prev: () => void;
  shuffleToggle: () => void;
  seek: (time: number) => void;
  closePlayer: () => void;

  repeatMode: RepeatMode;
  setRepeatMode: (m: RepeatMode) => void;

  getAudioElement: () => HTMLAudioElement | null;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playlist, setPlaylist] = useState<Track[]>(defaultAudios);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

  /* ---------- Core ---------- */
  const loadTrack = async (index: number) => {
    const track = playlist[index];
    if (!track) return;

    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    audio.pause();
    audio.currentTime = 0;
    audio.src = track.src;
    audio.load();

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    audio.onended = () => {
      if (repeatMode === "one") {
        loadTrack(currentIndex);
      } else {
        next();
      }
    };

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {}

    setCurrentIndex(index);
    setCurrentTrack(track);
    setIsOpen(true);
  };

  /* ---------- Controls ---------- */
  const playByIndex = (index: number) => {
    setPlaylist(defaultAudios);
    loadTrack(index);
  };

  const setQueueAndPlay = (tracks: Track[], startIndex = 0) => {
    if (!tracks.length) return;
    setPlaylist(tracks);
    loadTrack(startIndex);
  };

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
        setQueueAndPlay,
        getQueue: () => playlist,
        toggle,
        next,
        prev,
        shuffleToggle,
        seek,
        closePlayer,
        repeatMode,
        setRepeatMode,
        getAudioElement: () => audioRef.current,
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
