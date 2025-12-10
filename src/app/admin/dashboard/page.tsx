"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const STATUS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type Status = (typeof STATUS)[number];

type AdminOrder = {
  id: number;
  totalCents: number;
  status: Status;
  createdAt: string;
  user?: {
    id: number;
    name: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
  };
  orderItems: {
    id: number;
    quantity: number;
    priceCents: number;
    product: {
      title: string;
      category?: string | null;
      imageUrl?: string | null;
      // allow extra keys from API without breaking type
      [key: string]: any;
    };
  }[];
};

export default function AdminDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🧭 Auth & Role Check
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, sessionStatus, router]);

  // 📦 Fetch all orders
  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders/all")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchOrders();
    }
  }, [session]);

  const visibleOrders = useMemo(
    () => orders.filter((o) => (filter === "ALL" ? true : o.status === filter)),
    [orders, filter]
  );

  // 📊 Dashboard stats
  const dashboardStats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenueCents = orders.reduce((sum, o) => sum + o.totalCents, 0);
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;
    const processingCount = orders.filter((o) => o.status === "PROCESSING").length;

    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    ).length;

    return {
      totalOrders,
      totalRevenue: totalRevenueCents / 100,
      pendingCount,
      processingCount,
      todayOrders,
    };
  }, [orders]);

  // 🔁 Update order status
  const updateStatus = async (id: number, status: Status) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchOrders();
    } catch (e) {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExcelUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      alert("Please select an Excel (.xlsx) file");
      return;
    }

    try {
      setIsUploading(true);
      const form = new FormData();
      form.append("file", file);

      const upload = await fetch("/api/directory/upload-excel", {
        method: "POST",
        body: form,
      });

      const result = await upload.json();

      if (upload.ok) {
        alert(`Uploaded successfully: ${result.inserted} members added`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (error) {
      alert("Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadgeClasses = (status: Status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40";
      case "PROCESSING":
        return "bg-blue-500/20 text-blue-200 border border-blue-500/40";
      case "SHIPPED":
        return "bg-indigo-500/20 text-indigo-200 border border-indigo-500/40";
      case "DELIVERED":
        return "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40";
      case "CANCELLED":
        return "bg-rose-500/20 text-rose-200 border border-rose-500/40";
      default:
        return "bg-[#FFD97A]/20 text-[#FFD97A]";
    }
  };

  // 🕐 Loading state
  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-yellow-200">
        Checking credentials.
      </div>
    );
  }

  // 🛑 Unauthorized access
  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2B0A0A] via-[#4C1414] to-[#8B2F2F] px-4 py-8 sm:px-8 lg:px-12 text-[#FFF8E7]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#FFD97A] tracking-tight">
              Admin Control Center
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#FFE8B0]/80">
              Welcome back,{" "}
              <span className="font-semibold text-[#FFE8B0]">
                {session.user.name || "Admin"}
              </span>
              . You&apos;re logged in as{" "}
              <span className="font-semibold">Administrator</span>.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-2xl bg-black/20 border border-white/10 px-4 py-2 backdrop-blur-sm shadow">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm text-[#FFE8B0]/80">
              Role: <span className="font-semibold text-emerald-300">ADMIN</span>
            </span>
          </div>
        </header>

        {/* Top Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#4B1E00]/50 border border-[#FFD97A]/25 p-4 shadow-md backdrop-blur-md">
            <p className="text-xs uppercase tracking-wide text-[#FFE8B0]/60 mb-1">
              Total Orders
            </p>
            <p className="text-2xl font-semibold text-[#FFD97A]">
              {dashboardStats.totalOrders}
            </p>
            <p className="mt-1 text-xs text-[#FFE8B0]/70">
              {dashboardStats.todayOrders} placed today
            </p>
          </div>
          <div className="rounded-2xl bg-[#4B1E00]/50 border border-[#FFD97A]/25 p-4 shadow-md backdrop-blur-md">
            <p className="text-xs uppercase tracking-wide text-[#FFE8B0]/60 mb-1">
              Revenue
            </p>
            <p className="text-2xl font-semibold text-emerald-300">
              ₹ {dashboardStats.totalRevenue.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-[#FFE8B0]/70">
              Across all completed orders
            </p>
          </div>
          <div className="rounded-2xl bg-[#4B1E00]/50 border border-[#FFD97A]/25 p-4 shadow-md backdrop-blur-md">
            <p className="text-xs uppercase tracking-wide text-[#FFE8B0]/60 mb-1">
              Pending
            </p>
            <p className="text-2xl font-semibold text-yellow-300">
              {dashboardStats.pendingCount}
            </p>
            <p className="mt-1 text-xs text-[#FFE8B0]/70">Need your attention</p>
          </div>
          <div className="rounded-2xl bg-[#4B1E00]/50 border border-[#FFD97A]/25 p-4 shadow-md backdrop-blur-md">
            <p className="text-xs uppercase tracking-wide text-[#FFE8B0]/60 mb-1">
              In Processing
            </p>
            <p className="text-2xl font-semibold text-sky-300">
              {dashboardStats.processingCount}
            </p>
            <p className="mt-1 text-xs text-[#FFE8B0]/70">On their way</p>
          </div>
        </section>

        {/* Orders Management - FULL WIDTH */}
        <section className="bg-[#4B1E00]/40 border border-[#FFD97A]/30 rounded-2xl p-6 shadow-xl shadow-black/30 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FFD97A]">
                📦 Manage Orders
              </h2>
              <p className="mt-1 text-xs text-[#FFE8B0]/75">
                View and update order statuses in real time.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2 justify-end">
                {(["ALL", ...STATUS] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-all ${
                      filter === value
                        ? "bg-[#FFD97A] text-[#4B1E00] border-[#FFD97A]"
                        : "bg-black/20 text-[#FFE8B0]/80 border-white/10 hover:bg-black/30"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchOrders}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] text-xs font-semibold shadow-sm hover:shadow-md transition"
              >
                <span className="h-3 w-3 rounded-full border border-[#4B1E00]/40 bg-[#4B1E00]/10" />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[#FFF8E7]/10 rounded-xl p-4 shadow"
                >
                  <div className="h-3 bg-[#FFD97A]/30 w-1/3 mb-2 rounded" />
                  <div className="h-3 bg-[#FFD97A]/30 w-1/2 mb-2 rounded" />
                  <div className="h-3 bg-[#FFD97A]/20 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-[#FFE8B0]/80">
              <div className="text-4xl mb-2">🕊️</div>
              <p className="font-semibold text-sm">No orders match this filter</p>
              <p className="text-xs mt-1">
                Try selecting a different status or refresh to check new orders.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#FFD97A]/20 bg-black/10">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-[#FFD97A]/10 text-[#FFD97A] uppercase text-[10px] sm:text-xs">
                  <tr>
                    <th className="text-left px-3 py-3">Order</th>
                    <th className="text-left px-3 py-3">User</th>
                    <th className="text-left px-3 py-3">Items</th>
                    <th className="text-left px-3 py-3">Qty</th>
                    <th className="text-left px-3 py-3">Total</th>
                    <th className="text-left px-3 py-3">Status</th>
                    <th className="text-left px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFD97A]/10">
                  {visibleOrders.map((o, idx) => (
                    <tr
                      key={o.id}
                      className={`transition-colors ${
                        idx % 2 === 0 ? "bg-white/5" : "bg-white/0"
                      } hover:bg-[#FFD97A]/5`}
                    >
                      <td className="px-3 py-3 align-top whitespace-nowrap">
                        <div className="font-medium text-[#FFD97A]">#{o.id}</div>
                        <div className="text-[11px] text-[#FFF8E7]/70">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                      </td>

                      <td className="px-3 py-3 align-top min-w-[170px]">
                        <div className="font-medium">
                          {o.user?.name || "Registered User"}
                        </div>
                        <div className="text-[11px] text-[#FFF8E7]/70">
                          {o.user?.email || "—"}
                        </div>
                        {o.user?.phone && (
                          <div className="text-[11px] text-[#FFE8B0]/80 mt-1">
                            📞 {o.user.phone}
                          </div>
                        )}
                        {o.user?.address && (
                          <div className="text-[11px] text-[#FFE8B0]/80 mt-1 line-clamp-2">
                            📍 {o.user.address}
                          </div>
                        )}
                      </td>

                      {/* Items column – image, title, category */}
                      <td className="px-3 py-3 align-top min-w-[240px]">
                        <ul className="space-y-3">
                          {o.orderItems.map((it, index) => (
                            <li
                              key={it.id}
                              className="flex items-center gap-3 rounded-lg bg-white/5 px-2 py-2"
                            >
                              {/* Product image */}
                              {it.product.imageUrl ? (
                                <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-lg bg-black/20">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={it.product.imageUrl}
                                    alt={it.product.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-lg bg-black/20 flex items-center justify-center text-[10px] text-[#FFE8B0]/70">
                                  No img
                                </div>
                              )}

                              {/* Text details */}
                              <div className="flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] text-[#FFE8B0]/70">
                                    {index + 1}.
                                  </span>
                                  <span className="font-semibold text-xs sm:text-sm text-[#FFE8B0]">
                                    {it.product.title}
                                  </span>
                                </div>

                                {it.product.category && (
                                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[#FFD97A]/80">
                                    {it.product.category}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Quantity column – just quantities */}
                      <td className="px-3 py-3 align-top whitespace-nowrap">
                        <ul className="space-y-1 text-[11px] sm:text-xs text-right pr-2">
                          {o.orderItems.map((it) => (
                            <li key={it.id}>× {it.quantity}</li>
                          ))}
                        </ul>
                      </td>

                      <td className="px-3 py-3 align-top font-semibold text-[#FFD97A] whitespace-nowrap">
                        ₹ {(o.totalCents / 100).toFixed(2)}
                      </td>

                      <td className="px-3 py-3 align-top">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadgeClasses(
                            o.status
                          )}`}
                        >
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current/80" />
                          {o.status}
                        </span>
                      </td>

                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <select
                            className="border border-[#FFD97A]/30 bg-black/20 text-[11px] sm:text-xs text-[#FFF8E7] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#FFD97A]/60"
                            value={o.status}
                            onChange={(e) =>
                              updateStatus(o.id, e.target.value as Status)
                            }
                            disabled={updatingId === o.id}
                          >
                            {STATUS.map((s) => (
                              <option key={s} value={s} className="bg-[#4B1E00]">
                                {s}
                              </option>
                            ))}
                          </select>
                          {o.status === "PENDING" && (
                            <button
                              onClick={() => updateStatus(o.id, "PROCESSING")}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] font-semibold text-[11px] sm:text-xs hover:shadow-md disabled:opacity-60"
                              disabled={updatingId === o.id}
                            >
                              {updatingId === o.id ? "Updating." : "Start"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Directory & Upload block */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start mb-2 pt-2">
          <div className="space-y-6">
            {/* Directory Card (clickable) */}
            <div
              onClick={() => router.push("/admin/directory")}
              className="group cursor-pointer rounded-2xl bg-[#4B1E00]/40 border border-[#FFD97A]/40 shadow-md hover:shadow-xl hover:border-[#FFD97A]/80 transition-all duration-200 p-6 relative overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br from-[#FFD97A] via-transparent to-[#FF9F7A] transition-opacity duration-200" />
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-[#FFD97A] mb-1 flex items-center gap-2">
                  📇 Directory Management
                </h2>
                <p className="text-sm text-[#FFF8E7]/80">
                  Approve, reject, edit and manage directory members from a central
                  place.
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#FFE8B0]/70">
                  <span className="h-[1px] w-8 bg-[#FFE8B0]/40" />
                  Click to open directory panel
                </p>
              </div>
            </div>

            {/* Directory Excel Upload */}
            <section className="bg-[#4B1E00]/40 border border-[#FFD97A]/30 rounded-2xl p-6 shadow-md backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-[#FFD97A] mb-2">
                    📂 Upload Directory Excel
                  </h2>
                  <p className="text-xs sm:text-sm text-[#FFE8B0]/80 mb-3">
                    Upload an Excel (.xlsx) file containing directory members. Accepted
                    columns:
                    <br />
                    <span className="text-[11px] sm:text-xs">
                      <b>
                        Name, Email, Phone, Address, DateOfBirth, DateOfMarriage,
                        Organization
                      </b>
                    </span>
                  </p>
                </div>
                <span className="hidden sm:inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-wide bg-black/30 border border-white/10 text-[#FFE8B0]/70">
                  Bulk Import
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-xs text-[#FFE8B0]/70 mb-1 inline-block">
                    Choose Excel file
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx"
                      className="flex-1 border border-[#FFD97A]/40 text-xs text-[#FFF8E7] bg-black/10 p-2 rounded-lg file:mr-3 file:rounded-md file:border-0 file:bg-[#FFD97A] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#4B1E00] hover:file:bg-[#FFE28A] focus:outline-none focus:ring-1 focus:ring-[#FFD97A]/60"
                    />
                  </div>
                </label>

                <button
                  onClick={handleExcelUpload}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isUploading ? (
                    <>
                      <span className="h-3 w-3 border-2 border-[#4B1E00]/40 border-t-[#4B1E00] rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span>Upload Excel</span>
                      <span className="text-xs opacity-80">(.xlsx)</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* Right column left free for future widgets */}
          <div className="hidden lg:block" />
        </section>
      </div>
    </main>
  );
}
