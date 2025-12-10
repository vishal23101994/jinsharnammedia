import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

const YT = (path: string) =>
  `https://www.googleapis.com/youtube/v3/${path}${path.includes("?") ? "&" : "?"}key=${API_KEY}`;

const parseISODurationToSeconds = (iso?: string) => {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = parseInt(m?.[1] || "0", 10);
  const min = parseInt(m?.[2] || "0", 10);
  const s = parseInt(m?.[3] || "0", 10);
  return h * 3600 + min * 60 + s;
};

async function getChannel() {
  const res = await fetch(
    YT(`channels?part=snippet,statistics,contentDetails&id=${CHANNEL_ID}`),
    { cache: "no-store" }
  );
  const json = await res.json();
  return json.items?.[0];
}

async function getUploadsPlaylistItems(playlistId: string, pageToken?: string, max = 12) {
  const res = await fetch(
    YT(
      `playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${max}${
        pageToken ? `&pageToken=${pageToken}` : ""
      }`
    ),
    { cache: "no-store" }
  );
  const json = await res.json();
  return { items: json.items || [], nextPageToken: json.nextPageToken || null };
}

async function getVideoDetails(ids: string[]) {
  if (!ids.length) return { byId: {}, items: [] as any[] };
  const batched: string[][] = [];
  for (let i = 0; i < ids.length; i += 50) batched.push(ids.slice(i, i + 50));
  const all: any[] = [];
  for (const batch of batched) {
    const res = await fetch(
      YT(`videos?part=snippet,contentDetails,statistics&id=${batch.join(",")}`),
      { cache: "no-store" }
    );
    const json = await res.json();
    all.push(...(json.items || []));
  }
  const byId = Object.fromEntries(all.map((v) => [v.id, v]));
  return { byId, items: all };
}

function mergePlaylistSnippetsWithDetails(playlistItems: any[], detailsById: Record<string, any>) {
  return playlistItems
    .map((pi) => {
      const id = pi.contentDetails?.videoId;
      const d = detailsById[id];
      if (!id || !d) return null;
      return {
        id,
        snippet: d.snippet,
        contentDetails: d.contentDetails,
        statistics: d.statistics,
      };
    })
    .filter(Boolean);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") || "home"; // home | videos | shorts | live | playlists
    const pageToken = url.searchParams.get("pageToken") || "";
    const sort = url.searchParams.get("sort") || "latest"; // latest | oldest | popular

    const channel = await getChannel();
    const uploadsId = channel?.contentDetails?.relatedPlaylists?.uploads;

    const sorters: Record<string, (a: any, b: any) => number> = {
      latest: (a, b) =>
        new Date(b.snippet.publishedAt).getTime() -
        new Date(a.snippet.publishedAt).getTime(),
      oldest: (a, b) =>
        new Date(a.snippet.publishedAt).getTime() -
        new Date(b.snippet.publishedAt).getTime(),
      popular: (a, b) =>
        (parseInt(b.statistics?.viewCount || "0", 10) || 0) -
        (parseInt(a.statistics?.viewCount || "0", 10) || 0),
    };

    // HOME
    if (tab === "home") {
      const { items: plItems } = await getUploadsPlaylistItems(uploadsId, "", 50);
      const ids = plItems.map((p) => p.contentDetails.videoId);
      const { byId } = await getVideoDetails(ids);
      const merged = mergePlaylistSnippetsWithDetails(plItems, byId);

      const shorts = merged
        .filter((v) => parseISODurationToSeconds(v.contentDetails?.duration) < 60)
        .slice(0, 6);
      const latest = [...merged].sort(sorters.latest).slice(0, 6);
      const popular = [...merged].sort(sorters.popular).slice(0, 6);

      const plsRes = await fetch(
        YT(`playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=6`),
        { cache: "no-store" }
      );
      const plsData = await plsRes.json();

      return NextResponse.json({
        tab,
        channel,
        sections: { shorts, latest, popular, playlists: plsData.items || [] },
      });
    }

    // VIDEOS
    if (tab === "videos") {
      const { items, nextPageToken } = await getUploadsPlaylistItems(uploadsId, pageToken, 12);
      const ids = items.map((p) => p.contentDetails.videoId);
      const { byId } = await getVideoDetails(ids);
      const merged = mergePlaylistSnippetsWithDetails(items, byId).sort(sorters[sort]);
      return NextResponse.json({ tab, channel, data: merged, nextPageToken });
    }

    // SHORTS
    if (tab === "shorts") {
      const { items, nextPageToken } = await getUploadsPlaylistItems(uploadsId, pageToken, 30);
      const ids = items.map((p) => p.contentDetails.videoId);
      const { byId } = await getVideoDetails(ids);
      const merged = mergePlaylistSnippetsWithDetails(items, byId);
      const onlyShorts = merged
        .filter((v) => parseISODurationToSeconds(v.contentDetails?.duration) < 60)
        .sort(sorters[sort]);
      return NextResponse.json({ tab, channel, data: onlyShorts, nextPageToken });
    }

    // LIVE
    if (tab === "live") {
      const kinds = ["live", "upcoming", "completed"] as const;
      let combined: any[] = [];
      for (const kind of kinds) {
        const r = await fetch(
          YT(
            `search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=${kind}&order=date&maxResults=25`
          ),
          { cache: "no-store" }
        );
        const j = await r.json();
        combined.push(...(j.items || []));
      }
      const ids = combined.map((i: any) => i.id.videoId).filter(Boolean);
      const { byId } = await getVideoDetails(ids);
      const withStats = combined
        .map((i: any) => {
          const d = byId[i.id.videoId];
          if (!d) return null;
          return {
            id: i.id.videoId,
            snippet: i.snippet,
            contentDetails: d.contentDetails,
            statistics: d.statistics,
          };
        })
        .filter(Boolean)
        .sort(sorters[sort]);
      return NextResponse.json({ tab, channel, data: withStats });
    }

    // PLAYLISTS
    if (tab === "playlists") {
      const r = await fetch(
        YT(
          `playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=12${
            pageToken ? `&pageToken=${pageToken}` : ""
          }`
        ),
        { cache: "no-store" }
      );
      const j = await r.json();
      return NextResponse.json({
        tab,
        channel,
        data: j.items || [],
        nextPageToken: j.nextPageToken || null,
      });
    }

    return NextResponse.json({ tab, channel, data: [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch YouTube data" }, { status: 500 });
  }
}
