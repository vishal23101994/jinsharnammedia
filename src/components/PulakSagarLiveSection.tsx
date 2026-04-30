"use client";

import { useEffect, useMemo, useState } from "react";

export default function PulakSagarLiveSection() {
  const [live, setLive] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetch("https://jinsharnammedia.com/api/pulak-sagar-live")
      .then((r) => r.json())
      .then(setLive)
      .catch(console.error);
  }, []);

  const viharDays = useMemo(() => {
    if (!live?.startDate) return null;

    const start = new Date(live.startDate);
    const now = new Date();

    return Math.max(
      1,
      Math.ceil(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
  }, [live]);

  if (!live) return null;

  const getEmbedMapUrl = () => {
    if (live.mapLink) {
      const coordMatch = live.mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

      if (coordMatch) {
        return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
      }

      return `https://www.google.com/maps?q=${encodeURIComponent(
        live.mapLink
      )}&output=embed`;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(
      `${live.location}, ${live.state || ""}`
    )}&output=embed`;
  };

  return (
    <>
      <section className="relative py-28 bg-gradient-to-br from-[#FDF0BF] via-[#EBCF7C] to-[#D7AF53] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          {/* PREMIUM HEADER */}
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#3B2A00]/10 text-[#7A5500] text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              Live Spiritual Presence
            </span>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#2E1B00] leading-tight">
              Current Live Location
            </h2>

            <p className="mt-4 text-[#6B4A00] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Track the present spiritual journey, vihar location, and divine updates of <br/>
              <span className="font-semibold text-[#3B2A00]"> Shree Pulak Sagar Ji Maharaj</span>
            </p>

            <div className="w-40 h-[4px] bg-gradient-to-r from-transparent via-[#3B2A00] to-transparent mx-auto mt-6 rounded-full" />
          </div>

          {/* MAIN CARD */}
          <div className="grid lg:grid-cols-[1.2fr_450px] gap-12 rounded-[42px] border border-white/40 bg-white/25 backdrop-blur-2xl p-8 md:p-12 shadow-[0_35px_100px_rgba(0,0,0,0.18)]">

            {/* LEFT SIDE */}
            <div>

              <p className="uppercase tracking-[0.35em] text-sm text-[#8A6200] font-semibold mb-3">
                Rashtrasant Manogyacharya
              </p>

              <h3 className="text-5xl md:text-6xl font-serif text-[#2E1B00] leading-tight mb-8">
                {live.title}
              </h3>

              {/* INFO GRID */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                <InfoCard label="Current Location" value={`📍 ${live.location}`} />
                {live.state && <InfoCard label="State" value={live.state} />}
                {live.startDate && (
                  <InfoCard
                    label="Start Date"
                    value={new Date(live.startDate).toLocaleDateString()}
                  />
                )}
                {live.endDate && (
                  <InfoCard
                    label="End Date"
                    value={new Date(live.endDate).toLocaleDateString()}
                  />
                )}
                {viharDays && (
                  <InfoCard label="Days in Vihar" value={`${viharDays} Days`} />
                )}
              </div>

              {/* PREMIUM MESSAGE BOX */}
              <div className="relative rounded-[30px] border border-[#D4AF37]/30 bg-gradient-to-br from-white/50 to-[#FFF6D8]/60 p-7 mb-8 shadow-inner overflow-hidden">
                <div className="absolute top-3 left-5 text-6xl text-[#D4AF37]/25 font-serif">
                  “
                </div>

                <p className="relative z-10 pl-6 text-lg md:text-xl italic leading-relaxed text-[#4A3A10]">
                  {live.message}
                </p>
              </div>

              {/* MAP */}
              <div className="overflow-hidden rounded-[30px] border border-white/30 shadow-[0_15px_40px_rgba(0,0,0,0.12)] h-[220px] mb-6">
                <iframe
                  src={getEmbedMapUrl()}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <span className="text-sm text-[#6B4A00]">
                Updated: {new Date(live.updatedAt).toLocaleString()}
              </span>
            </div>

            {/* RIGHT PORTRAIT IMAGE */}
            <div>
              <div
                onClick={() => setShowImageModal(true)}
                className="relative cursor-pointer group"
              >
                <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-white/30 via-[#F7D777]/20 to-[#D4AF37]/20 blur-2xl" />

                <div className="relative rounded-[36px] p-2 bg-gradient-to-br from-[#FFF6D6] to-[#D4AF37] shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
                  <div className="overflow-hidden rounded-[30px] border border-white/40">
                    <img
                      src={live.imageUrl}
                      alt={live.title}
                      className="w-full h-[800px] object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="absolute top-6 left-6 px-5 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  LIVE NOW
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center">

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08),transparent_60%)]" />

          {/* Close Button */}
          <button
            onClick={() => {
              setShowImageModal(false);
              setZoom(1);
            }}
            className="absolute top-6 right-6 z-50
                      w-14 h-14 rounded-full
                      bg-white/10 backdrop-blur-md
                      border border-white/20
                      text-white text-3xl
                      hover:bg-red-500/80
                      transition-all duration-300"
          >
            ✕
          </button>

          {/* Floating Toolbar */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
              className="w-14 h-14 rounded-2xl
                        bg-white/10 backdrop-blur-md
                        border border-white/20
                        text-white text-2xl font-bold
                        hover:bg-white/20 hover:scale-110
                        transition-all"
            >
              +
            </button>

            <button
              onClick={() => setZoom((z) => Math.max(z - 0.2, 1))}
              className="w-14 h-14 rounded-2xl
                        bg-white/10 backdrop-blur-md
                        border border-white/20
                        text-white text-2xl font-bold
                        hover:bg-white/20 hover:scale-110
                        transition-all"
            >
              −
            </button>

            <button
              onClick={() => setZoom(1)}
              className="px-3 py-2 rounded-xl
                        bg-white/10 backdrop-blur-md
                        border border-white/20
                        text-white text-xs font-semibold
                        hover:bg-white/20 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Image Viewer */}
          <div className="relative w-[90vw] h-[90vh] overflow-hidden flex items-center justify-center">
            <img
              src={`http://localhost:3001${live.imageUrl}`}
              alt={live.title}
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.35s ease",
              }}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      )}
    </>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/35 backdrop-blur-md p-5 shadow-sm hover:shadow-lg transition">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#8A6200] mb-2 font-semibold">
        {label}
      </p>

      <p className="text-lg font-bold text-[#2E1B00]">
        {value}
      </p>
    </div>
  );
}