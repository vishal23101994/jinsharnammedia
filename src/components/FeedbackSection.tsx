"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

type FeedbackEntry = {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  image?: string | null;
  createdAt: string;
};

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(4);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/feedback")
      .then((res) => res.json())
      .then((json) => {
        if (json?.ok) setFeedbacks(json.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, rating, page: "/" }),
      });

      const json = await res.json();
      if (json.ok) {
        setFeedbacks((prev) => [json.data, ...prev]);
        setMessage("");
        setName("");
        setEmail("");
        setRating(null);
        setStatus("Your bhav has been received 🙏");
      }
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative py-28 bg-gradient-to-b from-[#FFF8E7] to-[#FFEEC2]">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif text-[#4B1E00]">
          Bhav Samarpan
        </h2>
        <p className="mt-3 italic text-[#4B1E00]/70">
          Offer your thoughts, experiences and blessings
        </p>
      </div>

      {/* FEEDBACK GRID */}
      <div className="max-w-6xl mx-auto px-6">
        {loading ? (
          <p className="text-center text-[#4B1E00]/60">Loading…</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-10">
              {feedbacks.slice(0, visible).map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="relative rounded-[2.5rem] p-8
                    bg-[linear-gradient(145deg,#FFFDF6,#FFF3CC)]
                    border-[3px] border-[#E6C670]
                    shadow-[0_25px_60px_rgba(185,122,43,0.25)]"
                >
                  {/* Inner dashed frame */}
                  <div className="absolute inset-5 rounded-[2rem]
                    border border-dashed border-[#E2B85C]/60" />

                  <div className="relative z-10 flex gap-5 items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {f.image ? (
                        <Image
                          src={f.image}
                          alt={f.name || "User"}
                          width={52}
                          height={52}
                          className="rounded-full border-2 border-[#FFD97A]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#FFE9B0]
                          flex items-center justify-center
                          font-semibold text-[#4B1E00] text-lg">
                          {(f.name || "A")[0]}
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <p className="italic text-[#4B1E00]/90 leading-relaxed">
                        “{f.message}”
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm text-[#4B1E00]/70">
                        <span>— {f.name || "A Devotee"}</span>
                        {f.rating && <span>{f.rating} ★</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* LOAD MORE */}
            {visible < feedbacks.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisible((v) => v + 4)}
                  className="rounded-full bg-[#FFD97A]
                    px-8 py-3 font-medium text-[#4B1E00]
                    shadow-md hover:scale-105 transition"
                >
                  View more blessings →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto mt-24 px-6">
        <h3 className="text-3xl font-serif text-center text-[#4B1E00] mb-6">
          Share Your Experience
        </h3>

        <form
          onSubmit={submit}
          className="relative bg-[#FFFDF6] rounded-3xl p-10
            border-[3px] border-[#E6C670]
            shadow-[0_25px_60px_rgba(185,122,43,0.25)]"
        >
          <div className="absolute inset-6 rounded-2xl
            border border-dashed border-[#E2B85C]/60" />

          <div className="relative z-10 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="px-4 py-3 rounded-md border border-[#FFD97A]/40 bg-[#FFF9ED]"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="px-4 py-3 rounded-md border border-[#FFD97A]/40 bg-[#FFF9ED]"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <textarea
              className="w-full px-4 py-3 rounded-md border border-[#FFD97A]/40 bg-[#FFF9ED] min-h-[140px]"
              placeholder="Share your thoughts or experience"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={`w-10 h-10 rounded-full border
                    ${rating === n ? "bg-[#FFD97A]" : "border-[#FFD97A]/40"}`}
                >
                  {n}★
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                disabled={submitting}
                className="rounded-full bg-[#FFD97A]
                  px-10 py-3 font-medium text-[#4B1E00]
                  shadow-md hover:scale-105 transition"
              >
                {submitting ? "Offering…" : "Submit Bhav"}
              </button>
            </div>

            {status && (
              <p className="text-center text-sm text-green-700 mt-2">
                {status}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
