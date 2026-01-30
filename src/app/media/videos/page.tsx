"use client";
import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import {
  Home,
  Video as VideoIcon,
  Play,
  Radio,
  List,
  SlidersHorizontal,
  Search,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Tab = "home" | "videos" | "shorts" | "live" | "playlists";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
const YT_CHANNEL_ID =
  (process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID as string) ||
  "UC9gyfaZ_ag9XxrlVqQ3g3QQ";

declare global {
  interface Window {
    google?: any;
  }
}

const OTHER_CHANNELS = [
  {
    name: "Pulak Bhajan",
    url: "https://www.youtube.com/channel/UCSrH8S5hb6IlI9o7LmdG1rA",
  },
  {
    name: "Jain Bhakti",
    url: "https://www.youtube.com/channel/UCG_CLytD3CThclRvdKWNndw",
  },
  {
    name: "Pulakvani News",
    url: "https://www.youtube.com/channel/UC-ds1gWjZnDGv1UaLT2uosA",
  },
  {
    name: "Kids Masti World",
    url: "https://www.youtube.com/channel/UCYQlyZBYGd5hcPwXzd4odFg",
  },
  {
    name: "Jyotish Samadhan",
    url: "https://www.youtube.com/channel/UCL2DHB7Ej6IKc42v8USR50Q",
  },
  {
    name: "Aakhir Aisa Kyon",
    url: "https://www.youtube.com/channel/UCSGrU6SXeBkvZcIDYsU_7hg",
  },
  {
    name: "Pulak Sagar Shorts",
    url: "https://www.youtube.com/channel/UCS6WvgPNmY_lZ1eh-A_lQYw",
  },
];


export default function JinsharnamMediaSpiritual() {
  const [channel, setChannel] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [items, setItems] = useState<any[]>([]);
  const [sections, setSections] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "popular" | "oldest">("latest");
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // modal player
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [videoList, setVideoList] = useState<any[]>([]);

  const tabs = [
    { id: "home", label: "Home", icon: <Home size={16} /> },
    { id: "videos", label: "Videos", icon: <VideoIcon size={16} /> },
    { id: "shorts", label: "Shorts", icon: <Play size={16} /> },
    { id: "live", label: "Live", icon: <Radio size={16} /> },
    { id: "playlists", label: "Playlists", icon: <List size={16} /> },
  ] as const;

  const fetchTab = async (
    newTab: Tab,
    opts?: { pageToken?: string; keep?: boolean; useSort?: typeof sort }
  ) => {
    setLoading(true);
    const s = opts?.useSort ?? sort;
    const qs = new URLSearchParams({ tab: newTab, sort: s });
    if (opts?.pageToken) qs.set("pageToken", opts.pageToken);

    const res = await fetch(`/api/youtube/latest?${qs.toString()}`);
    const data = await res.json();

    setChannel(data.channel || null);

    if (newTab === "home") {
      setSections(data.sections || null);
      setItems([]);
      setVideoList([]);
      setNextPageToken(null);
    } else {
      const list = opts?.keep ? [...items, ...(data.data || [])] : data.data || [];
      setSections(null);
      setItems(list);
      setVideoList(list);
      setNextPageToken(data.nextPageToken || null);
    }

    setTab(newTab);
    setLoading(false);
  };

  useEffect(() => {
    fetchTab("home");
  }, []);

  const subCount = useMemo(
    () => (channel ? Number(channel.statistics?.subscriberCount || 0) : 0),
    [channel]
  );
  const videoCount = useMemo(
    () => (channel ? Number(channel.statistics?.videoCount || 0) : 0),
    [channel]
  );

  const getVideoId = (v: any) => v.id?.videoId || v.id || v.contentDetails?.videoId;

  const filtered = items.filter((v) =>
    `${v.snippet?.title ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const currentVideo = selectedIndex !== null ? videoList[selectedIndex] : null;
  const currentId = currentVideo ? getVideoId(currentVideo) : null;

  const goNext = () => {
    if (selectedIndex === null || selectedIndex >= videoList.length - 1) return;
    setSelectedIndex(selectedIndex + 1);
  };
  const goPrev = () => {
    if (selectedIndex === null || selectedIndex <= 0) return;
    setSelectedIndex(selectedIndex - 1);
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED] text-[#3E2723] relative">
      {/* GIS script for OAuth subscribe */}
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#FFF8ED] via-[#FAF3DD] to-[#FFF8ED] border-b border-[#E0C097] backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {channel && (
            <img
              src={channel.snippet?.thumbnails?.high?.url}
              alt="Channel"
              className="w-10 h-10 rounded-full shadow-md border border-[#D4AF37]"
            />
          )}
          <div>
            <h1 className="font-semibold text-lg text-[#3E2723]">
              {channel?.snippet?.title ?? "Channel"}
            </h1>
            <p className="text-xs text-[#6D4C41]">
              {subCount.toLocaleString()} subscribers • {videoCount.toLocaleString()} videos
            </p>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 border border-[#E0C097] rounded-full px-4 py-2 bg-[#FFFAF0] shadow-sm">
              <Search size={16} className="text-[#B8860B]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-[#3E2723]"
                placeholder="Search divine content..."
              />
            </div>
          </div>
        </div>

        {/* Tabs & Sort */}
        <div className="border-t border-[#E0C097]">
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => fetchTab(t.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  tab === t.id
                    ? "bg-[#B8860B] text-white shadow-inner"
                    : "bg-[#FFF3E0] hover:bg-[#F8E1A1] text-[#3E2723]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}

            {(tab === "videos" || tab === "shorts" || tab === "live") && (
              <div className="ml-auto flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#B8860B]" />
                <select
                  value={sort}
                  onChange={(e) => {
                    const v = e.target.value as typeof sort;
                    setSort(v);
                    fetchTab(tab, { useSort: v });
                  }}
                  className="border border-[#E0C097] rounded-full px-3 py-1 text-sm bg-[#FFFAF0]"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* HOME with See more links */}
        {tab === "home" && sections && (
          <>
            <div className="space-y-10">
              <Section
                title="🌼 Latest Uploads"
                items={sections.latest}
                onVideoClick={(v: any) => {
                  setVideoList(sections.latest);
                  setSelectedIndex(sections.latest.indexOf(v));
                }}
                onSeeMore={() => fetchTab("videos", { useSort: "latest" })}
              />

              <Section
                title="🔥 Popular"
                items={sections.popular}
                onVideoClick={(v: any) => {
                  setVideoList(sections.popular);
                  setSelectedIndex(sections.popular.indexOf(v));
                }}
                onSeeMore={() => fetchTab("videos", { useSort: "popular" })}
              />

              <Section
                title="🎬 Shorts"
                items={sections.shorts}
                isShorts
                onVideoClick={(v: any) => {
                  setVideoList(sections.shorts);
                  setSelectedIndex(sections.shorts.indexOf(v));
                }}
                onSeeMore={() => fetchTab("shorts", { useSort: "latest" })}
              />

              <PlaylistsSection
                title="📜 Playlists"
                items={sections.playlists}
                onSeeMore={() => fetchTab("playlists")}
              />
            </div>

            {/* OTHER YOUTUBE CHANNELS */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-[#3E2723] mb-6">
                📺 Our Other YouTube Channels
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {OTHER_CHANNELS.map((ch) => (
                  <div
                    key={ch.url}
                    className="bg-white rounded-2xl border border-[#E0C097]
                               shadow-md hover:shadow-xl transition
                               p-5 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-600
                                      text-white flex items-center justify-center
                                      text-xl font-bold">
                        ▶
                      </div>
                      <h3 className="font-semibold text-[#3E2723] leading-snug">
                        {ch.name}
                      </h3>
                    </div>

                    <a
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-center px-4 py-2 rounded-full
                                 bg-[#FFF3E0] hover:bg-[#F8E1A1]
                                 text-[#3E2723] font-medium transition"
                    >
                      Visit Channel →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VIDEOS / SHORTS / LIVE with See more */}
        {(tab === "videos" || tab === "shorts" || tab === "live") && (
          <>
            {loading ? (
              <p className="text-center text-[#6D4C41]">Loading…</p>
            ) : (
              <Grid
                items={filtered}
                isShorts={tab === "shorts"}
                onVideoClick={(v: any) => {
                  setVideoList(filtered);
                  setSelectedIndex(filtered.indexOf(v));
                }}
              />
            )}

            {/* See more for tabs that paginate (YouTube API doesn't paginate our combined LIVE set) */}
            {nextPageToken && tab !== "live" && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchTab(tab, { pageToken: nextPageToken, keep: true })}
                  className="px-6 py-2 rounded-full bg-[#FFF3E0] hover:bg-[#F8E1A1] text-[#3E2723] font-medium"
                >
                  See more
                </button>
              </div>
            )}

            {tab === "live" && !filtered.length && (
              <p className="text-center text-[#6D4C41] mt-4">
                No Live / Upcoming / Past livestreams found.
              </p>
            )}
          </>
        )}

        {/* PLAYLISTS with See more */}
        {tab === "playlists" && (
          <>
            {loading ? (
              <p className="text-center text-[#6D4C41]">Loading…</p>
            ) : (
              <PlaylistsSection title="📚 Spiritual Playlists" items={filtered} />
            )}
            {nextPageToken && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchTab("playlists", { pageToken: nextPageToken, keep: true })}
                  className="px-6 py-2 rounded-full bg-[#FFF3E0] hover:bg-[#F8E1A1] text-[#3E2723] font-medium"
                >
                  See more
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Player */}
      {selectedIndex !== null && currentId && (
        <div
          className="fixed inset-0 bg-[#3E2723]/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative bg-[#FFF8ED] border-2 border-[#B8860B] rounded-2xl shadow-2xl p-2 w-[90%] md:w-[70%] lg:w-[60%]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-[#6D4C41] hover:text-[#B8860B]"
              onClick={() => setSelectedIndex(null)}
            >
              <XCircle size={28} />
            </button>

            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${currentId}?autoplay=1&rel=0`}
              title={currentVideo.snippet?.title}
              className="rounded-xl mb-3"
              allowFullScreen
            ></iframe>

            <div className="flex items-center justify-between px-3">
              <button
                onClick={goPrev}
                disabled={selectedIndex === 0}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium ${
                  selectedIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFF3E0] hover:bg-[#F8E1A1] text-[#3E2723]"
                }`}
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <h2 className="text-lg font-semibold text-center text-[#3E2723] line-clamp-2">
                {currentVideo.snippet?.title}
              </h2>

              <button
                onClick={goNext}
                disabled={selectedIndex === videoList.length - 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium ${
                  selectedIndex === videoList.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFF3E0] hover:bg-[#F8E1A1] text-[#3E2723]"
                }`}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Components ---------- */
function Grid({ items, isShorts, onVideoClick }: any) {
  return (
    <div
      className={`grid gap-8 ${
        isShorts ? "grid-cols-2 md:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {items.map((v: any) => (
        <div
          key={v.id}
          onClick={() => onVideoClick(v)}
          className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition"
        >
          <img
            src={v.snippet?.thumbnails?.medium?.url}
            alt={v.snippet?.title}
            className="w-full h-52 object-cover"
          />
          <div className="p-4">
            <p className="font-medium text-[#3E2723] line-clamp-2">{v.snippet?.title}</p>
            <p className="text-sm text-[#6D4C41] mt-1">
              {new Date(v.snippet?.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  items,
  onVideoClick,
  isShorts,
  onSeeMore,
}: {
  title: string;
  items: any[];
  onVideoClick: (v: any) => void;
  isShorts?: boolean;
  onSeeMore: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold text-[#3E2723]">{title}</h2>
        <button onClick={onSeeMore} className="text-[#B8860B] hover:underline">
          See more →
        </button>
      </div>
      <Grid items={items} isShorts={!!isShorts} onVideoClick={onVideoClick} />
    </div>
  );
}

function PlaylistsSection({
  title,
  items,
  onSeeMore,
}: {
  title: string;
  items: any[];
  onSeeMore?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold text-[#3E2723]">{title}</h2>
        {onSeeMore && (
          <button onClick={onSeeMore} className="text-[#B8860B] hover:underline">
            See more →
          </button>
        )}
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p: any) => (
          <div
            key={p.id}
            onClick={() => window.open(`https://www.youtube.com/playlist?list=${p.id}`, "_blank")}
            className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition"
          >
            <div className="relative">
              <img
                src={p.snippet?.thumbnails?.medium?.url}
                alt={p.snippet?.title}
                className="w-full h-52 object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-[#B8860B]/80 text-white text-xs px-2 py-1 rounded">
                ▶ {p.contentDetails?.itemCount} videos
              </div>
            </div>
            <div className="p-4">
              <p className="font-medium text-[#3E2723] line-clamp-2">{p.snippet?.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}