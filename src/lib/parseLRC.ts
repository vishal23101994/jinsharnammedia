export type LyricLine = {
  time: number;
  text: string;
};

export function parseLRC(lrcText: string): LyricLine[] {
  return lrcText
    .split("\n")
    .map(line => {
      const match = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
      if (!match) return null;

      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;

      return {
        time,
        text: match[3].trim()
      };
    })
    .filter(Boolean) as LyricLine[];
}
