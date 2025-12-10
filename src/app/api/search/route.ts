import { NextResponse } from "next/server";

export async function GET() {
  // In a real app, this could fetch from your DB or CMS.
  const data = [
    // 🌐 Pages
    {
      title: "Home",
      description: "Welcome to Jinsharnam Media, spreading peace and knowledge.",
      type: "page",
      path: "/",
    },
    {
      title: "Pulak Sagar",
      description: "Teachings and discourses by Pulak Sagar Ji Maharaj.",
      type: "page",
      path: "/pulak-sagar",
    },
    {
      title: "Jinsharnam Tirth",
      description: "Explore the sacred Jinsharnam Tirth pilgrimage site.",
      type: "page",
      path: "/jinsharnam-tirth",
    },
    {
      title: "About",
      description: "Learn more about Jinsharnam Media’s vision and mission.",
      type: "page",
      path: "/about",
    },

    // 🎥 Videos
    {
      title: "Morning Pravachan by Pulak Sagar Ji",
      description: "Daily morning spiritual discourse from Pulak Sagar Ji.",
      type: "video",
      path: "/videos/morning-pravachan",
    },
    {
      title: "Meditation for Inner Peace",
      description: "Guided meditation videos for peace and clarity.",
      type: "video",
      path: "/videos/meditation-peace",
    },

    // 🛍 Store Items
    {
      title: "Spiritual Books Collection",
      description: "Buy Jainism books and sacred scriptures online.",
      type: "store",
      path: "/store/books",
    },
    {
      title: "Temple Idols & Artifacts",
      description: "Shop handcrafted idols and temple accessories.",
      type: "store",
      path: "/store/idols",
    },
  ];

  return NextResponse.json(data);
}
