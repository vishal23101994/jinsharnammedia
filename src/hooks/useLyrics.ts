import { useEffect, useState } from "react";
import { parseLRC, LyricLine } from "@/lib/parseLRC";
import { lyricsMap } from "@/data/lyricsMap";

export function useLyrics(audioSrc?: string) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);

  useEffect(() => {
    if (!audioSrc || !lyricsMap[audioSrc]) {
      setLyrics([]);
      return;
    }

    fetch(`/lyrics/${lyricsMap[audioSrc]}`)
      .then(res => res.text())
      .then(text => setLyrics(parseLRC(text)))
      .catch(() => setLyrics([]));
  }, [audioSrc]);

  return lyrics;
}
