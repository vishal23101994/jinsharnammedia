"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(true);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalizeOrder = async () => {
      try {
        const cartJson = localStorage.getItem("jinsharnam_cart");
        const cart = cartJson ? JSON.parse(cartJson) : [];

        const totalCents = cart.reduce(
          (sum: number, item: any) => sum + item.priceCents * item.qty,
          0
        );

        const paymentId = sessionStorage.getItem("payment_id") || null;

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            totalCents,
            paymentId,
            paymentStatus: "PAID",
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to save order");

        setOrderId(data.id);

        localStorage.removeItem("jinsharnam_cart");
        // optional: sessionStorage.removeItem("payment_id");

        setTimeout(() => router.push("/user/orders"), 4000);
      } catch (err: any) {
        console.error("Error saving order:", err);
        setError(err.message);
      } finally {
        setSaving(false);
      }
    };

    finalizeOrder();
  }, [router]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3A0D0D] via-[#5C1A1A] to-[#8B2F2F] text-white p-6 text-center">
      {saving ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-3xl text-[#FFD97A] font-serif"
        >
          Processing your order...
        </motion.div>
      ) : error ? (
        <div>
          <h1 className="text-2xl text-red-400 font-semibold mb-3">
            ❌ Order Saving Failed
          </h1>
          <p className="text-sm text-yellow-200/80">{error}</p>
          <button
            onClick={() => router.push("/store")}
            className="mt-6 px-6 py-2 rounded-lg bg-[#FFD97A] text-[#4B1E00] hover:bg-[#FFE28A] transition"
          >
            Back to Store
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-serif text-[#FFD97A] mb-2">
            Thank you for your order!
          </h1>
          <p className="text-yellow-200/90">
            Your order <span className="font-semibold">#{orderId}</span> has
            been placed successfully.
          </p>
          <p className="text-yellow-100 mt-2 text-sm">
            Redirecting to your orders...
          </p>
        </motion.div>
      )}
    </section>
  );
}
