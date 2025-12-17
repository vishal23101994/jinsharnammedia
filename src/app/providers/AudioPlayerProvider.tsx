"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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

  play: (track: Track, playlist?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  shuffle: () => void;
  seek: (time: number) => void;
  closePlayer: () => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // create audio once
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime)
    );
    audio.addEventListener("loadedmetadata", () =>
      setDuration(audio.duration)
    );
    audio.addEventListener("ended", next);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const play = (track: Track, list: Track[] = []) => {
    if (!audioRef.current) return;

    if (list.length) {
      setPlaylist(list);
      setIndex(list.findIndex((t) => t.src === track.src));
    }

    audioRef.current.src = track.src;
    audioRef.current.play();

    setCurrentTrack(track);
    setIsPlaying(true);
    setIsOpen(true);
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const next = () => {
    if (!playlist.length) return;
    const nextIndex = (index + 1) % playlist.length;
    play(playlist[nextIndex], playlist);
  };

  const prev = () => {
    if (!playlist.length) return;
    const prevIndex =
      (index - 1 + playlist.length) % playlist.length;
    play(playlist[prevIndex], playlist);
  };

  const shuffle = () => {
    if (!playlist.length) return;
    const rand = Math.floor(Math.random() * playlist.length);
    play(playlist[rand], playlist);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const closePlayer = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = "";
    setIsPlaying(false);
    setCurrentTrack(null);
    setIsOpen(false);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        isOpen,
        play,
        toggle,
        next,
        prev,
        shuffle,
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
  if (!ctx)
    throw new Error("useAudioPlayer must be used inside provider");
  return ctx;
};
