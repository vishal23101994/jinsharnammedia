"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-amber-800">My Orders</h1>
          <Link href="/store" className="text-amber-700 hover:underline">
            ← Back to Store
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-6 shadow">
                <div className="h-4 bg-gray-200 w-1/3 mb-3 rounded" />
                <div className="h-4 bg-gray-200 w-1/5 rounded" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders yet.</p>
        ) : (
          <div className="grid gap-6">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-6 shadow border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{o.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-amber-700">{o.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold">₹ {(o.totalCents / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed</p>
                    <p>{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  {o.items?.map((it: any) => (
                    <div key={it.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product?.imageUrl || "/images/default.jpg"}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{it.product?.title}</p>
                          <p className="text-sm text-gray-500">Qty: {it.qty}</p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ₹ {((it.priceCents * it.qty) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
