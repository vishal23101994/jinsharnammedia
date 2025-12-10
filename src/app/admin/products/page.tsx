"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceCents: "",
    imageUrl: "",
    sku: "",
    active: true,
  });

  // ✅ Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // ✅ Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Handle form submission (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingProduct ? "PATCH" : "POST";
    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : "/api/products";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priceCents: Number(formData.priceCents),
        }),
      });

      if (res.ok) {
        await fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
      } else {
        console.error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const resetForm = () =>
    setFormData({
      title: "",
      description: "",
      priceCents: "",
      imageUrl: "",
      sku: "",
      active: true,
    });

  if (status === "loading")
    return (
      <p className="text-center text-yellow-200 mt-10 animate-pulse">
        Checking session...
      </p>
    );

  if (!session || session.user.role !== "ADMIN") return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#3A0D0D] via-[#5C1A1A] to-[#8B2F2F] text-[#FFF8E7] p-8">
      <h1 className="text-4xl font-serif text-center text-[#FFD97A] mb-8">
        🛍️ Product Management
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
            setEditingProduct(null);
          }}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] font-semibold shadow hover:shadow-lg transition"
        >
          {showForm ? "Cancel" : "➕ Add Product"}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto bg-[#4B1E00]/50 border border-[#FFD97A]/30 rounded-2xl p-6 space-y-4 shadow-md"
        >
          <h2 className="text-xl text-[#FFD97A] font-semibold mb-4">
            {editingProduct ? "✏️ Edit Product" : "🆕 New Product"}
          </h2>

          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Product Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="p-3 rounded bg-[#FFF8E7]/10 border border-[#FFD97A]/30 focus:outline-none focus:border-[#FFD97A]"
              required
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="p-3 rounded bg-[#FFF8E7]/10 border border-[#FFD97A]/30 focus:outline-none focus:border-[#FFD97A]"
            />

            <input
              type="number"
              placeholder="Price (in ₹)"
              value={formData.priceCents}
              onChange={(e) =>
                setFormData({ ...formData, priceCents: e.target.value })
              }
              className="p-3 rounded bg-[#FFF8E7]/10 border border-[#FFD97A]/30 focus:outline-none focus:border-[#FFD97A]"
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="p-3 rounded bg-[#FFF8E7]/10 border border-[#FFD97A]/30 focus:outline-none focus:border-[#FFD97A]"
            />

            <input
              type="text"
              placeholder="SKU (optional)"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="p-3 rounded bg-[#FFF8E7]/10 border border-[#FFD97A]/30 focus:outline-none focus:border-[#FFD97A]"
            />

            <label className="flex items-center gap-2 text-[#FFD97A]/80">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
              Active Product
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-3 bg-gradient-to-r from-[#FFD97A] to-[#FFE28A] text-[#4B1E00] font-semibold rounded-lg shadow hover:shadow-lg transition"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </motion.form>
      )}

      {/* Product List */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {loading ? (
          <p className="text-center text-yellow-200 col-span-3">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-yellow-200 col-span-3">
            No products found.
          </p>
        ) : (
          products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#4B1E00]/50 border border-[#FFD97A]/30 rounded-2xl shadow-md p-5 flex flex-col justify-between"
            >
              <div>
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-[#FFD97A] mb-1">
                  {p.title}
                </h3>
                <p className="text-sm text-[#FFF8E7]/80 mb-2">
                  ₹{(p.priceCents / 100).toFixed(2)}
                </p>
                <p className="text-xs text-[#FFF8E7]/60 mb-4">
                  {p.description || "No description"}
                </p>
              </div>

              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setFormData({
                      title: p.title,
                      description: p.description || "",
                      priceCents: (p.priceCents / 100).toFixed(2),
                      imageUrl: p.imageUrl || "",
                      sku: p.sku,
                      active: p.active,
                    });
                    setShowForm(true);
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-[#FFD97A]/20 hover:bg-[#FFD97A]/30 text-[#FFD97A]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600/60 hover:bg-red-700/70 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
