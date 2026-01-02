"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Update = {
  id: string;
  title: string;
  imageUrl?: string;
};

const CATEGORY_MAP: Record<string, string> = {
  jinsharnam: "JINSHARNAM",
  vatsalya: "VATSALYA",
  advertisement: "ADVERTISEMENT",
};

export default function UpdatesGallery() {
  const params = useParams<{ category: string }>();
  const category = params.category;

  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    if (!category) return;

    fetch(`/api/latest-update?category=${CATEGORY_MAP[category]}`)
      .then((res) => res.json())
      .then((json) => setUpdates(json.data || []));
  }, [category]);

  if (!category) return null;

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-serif text-center mb-16 text-[#4B1E00]">
        {category.replace("-", " ").toUpperCase()}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {updates.map((update) => (
          <div
            key={update.id}
            className="rounded-2xl overflow-hidden shadow-lg bg-white"
          >
            {update.imageUrl && (
              <img
                src={update.imageUrl}
                alt={update.title}
                className="h-72 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-[#4B1E00]">
                {update.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
