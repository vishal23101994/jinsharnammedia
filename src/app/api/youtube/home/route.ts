import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

const YT = (path: string) =>
  `https://www.googleapis.com/youtube/v3/${path}${path.includes("?") ? "&" : "?"}key=${API_KEY}`;

async function getLatestVideos() {
  try {
    // Get channel uploads playlist ID
    const channelRes = await fetch(
      YT(`channels?part=contentDetails&id=${CHANNEL_ID}`),
      { cache: "no-store" }
    );
    const channelData = await channelRes.json();
    const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsId) throw new Error("Uploads playlist not found.");

    // Fetch latest uploads (limit 6)
    const playlistRes = await fetch(
      YT(`playlistItems?part=snippet,contentDetails&playlistId=${uploadsId}&maxResults=6`),
      { cache: "no-store" }
    );
    const playlistData = await playlistRes.json();
    const videos = playlistData.items || [];

    return videos.map((v: any) => ({
      id: v.contentDetails.videoId,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails.medium.url,
      publishedAt: v.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching latest YouTube videos:", error);
    return [];
  }
}

export async function GET() {
  const videos = await getLatestVideos();

  if (!videos.length) {
    return NextResponse.json(
      { message: "No recent videos found on Jinsharnam Media." },
      { status: 404 }
    );
  }

  return NextResponse.json({ latestVideos: videos });
}
