"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UserOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/orders/user/${session.user.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch orders");

        setOrders(data);
      } catch (err: any) {
        console.error("Error loading user orders:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (loading)
    return (
      <p className="text-center text-yellow-300 mt-10 animate-pulse">
        Loading your orders...
      </p>
    );

  if (error)
    return (
      <div className="text-center mt-20 text-red-400">
        <p>⚠️ {error}</p>
        <button
          onClick={() => location.reload()}
          className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          Retry
        </button>
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#3A0D0D] via-[#5C1A1A] to-[#8B2F2F] text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-serif text-[#FFD97A] mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-yellow-200 text-center text-lg mt-10"
        >
          You have no previous orders yet.
          <div className="mt-4">
            <a
              href="/store"
              className="px-6 py-2 bg-[#FFD97A] text-[#4B1E00] font-medium rounded-lg hover:bg-[#FFE28A] transition"
            >
              Shop Now
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-3xl space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#4B1E00]/50 border border-[#FFD97A]/30 rounded-xl p-5 shadow-md backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex justify-between mb-3">
                <p className="text-yellow-300 font-semibold">
                  Order #{order.id}
                </p>
                <p className="text-sm text-yellow-200/70">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.orderItems?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-[#FFD97A]/20 pb-2"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-md border border-[#FFD97A]/30 object-cover"
                        />
                      )}
                      <span className="font-medium text-yellow-100">
                        {item.product?.title || "Product"}
                      </span>
                    </div>
                    <div className="text-sm text-yellow-200/80">
                      ₹{(item.priceCents / 100).toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-yellow-300 font-semibold">
                  Total: ₹{(order.totalCents / 100).toFixed(2)}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    order.status === "delivered"
                      ? "bg-green-600/60 text-green-100"
                      : order.status === "shipped"
                      ? "bg-blue-600/60 text-blue-100"
                      : order.status === "processing"
                      ? "bg-yellow-600/60 text-yellow-100"
                      : "bg-gray-600/60 text-gray-200"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
