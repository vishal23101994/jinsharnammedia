"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Product = {
  id: string;
  title: string;
  category?: "Book" | "Calendar" | "Poster";
  description?: string;
  priceCents: number;
  imageUrl?: string;
  featured?: boolean;
};

type CartItem = Product & { qty: number };

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      console.log("Razorpay script already present (store page)");
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log(
        "Razorpay script loaded (store page), window.Razorpay =",
        window.Razorpay
      );
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script (store page)");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function StorePage() {
  const [items, setItems] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const { data: session } = useSession();

  // Fetch products
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];
        setItems(products);
        setFiltered(products);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("jinsharnam_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("jinsharnam_cart", JSON.stringify(cart));
  }, [cart]);

  // Filter & search
  useEffect(() => {
    const safeItems = items.map((i) => ({
      ...i,
      category: i.category ? i.category.trim().toLowerCase() : "uncategorized",
    }));

    let result = [...safeItems];

    if (selectedCategory !== "All") {
      result = result.filter(
        (i) =>
          i.category &&
          i.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      result = result.filter((i) =>
        i.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(result);
  }, [searchTerm, selectedCategory, items]);

  // Cart logic
  const addToCart = (product: Product) => {
    if (!session?.user) {
      // open auth modal with cart reason
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", { detail: { reason: "cart" } })
      );
      return;
    }

    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: p.qty > 1 ? p.qty - 1 : 0 } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const totalAmount = cart.reduce((sum, p) => sum + p.priceCents * p.qty, 0);

  // Checkout (Razorpay or COD)
  const handleCheckout = async () => {
    if (!session?.user) {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", { detail: { reason: "cart" } })
      );
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // 💵 COD flow (no Razorpay)
    if (paymentMethod === "COD") {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            paymentStatus: "COD_PENDING",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("COD order creation failed:", data);
          throw new Error(data.error || "Failed to create COD order");
        }

        localStorage.removeItem("jinsharnam_cart");
        setCart([]);
        window.location.href = "/user/orders";
      } catch (error) {
        console.error("COD checkout error:", error);
        alert("Error creating COD order. Please try again.");
      }
      return;
    }

    // 💳 Online payment via Razorpay
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Unable to load Razorpay. Please check your internet and try again.");
        return;
      }

      if (typeof window.Razorpay !== "function") {
        console.error(
          "window.Razorpay is NOT a constructor in handleCheckout:",
          window.Razorpay
        );
        alert("Payment system is not ready. Please refresh and try again.");
        return;
      }

      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();
      if (!res.ok || !data?.id) {
        console.error("Order creation failed:", data);
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Jinsharnam Media",
        description: "Cart Checkout",
        order_id: data.id,
        handler: async function (response: any) {
          try {
            if (response?.razorpay_payment_id) {
              sessionStorage.setItem(
                "payment_id",
                response.razorpay_payment_id
              );
            }

            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              window.location.href = "/store/success";
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("Error verifying payment. Please contact support.");
          }
        },
        theme: { color: "#CFAF72" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error during checkout. Please try again.");
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-3xl shadow p-5 h-72"
          >
            <div className="bg-gray-200 h-40 w-full rounded-xl mb-4"></div>
            <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 w-1/2"></div>
          </div>
        ))}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100/40 to-white text-gray-800">
      {/* Hero */}
      <section className="relative w-full h-[420px] flex items-center justify-center text-center overflow-hidden">
        <img
          src="/images/redtextured.jpg"
          alt="Jinsharnam Media Store"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-100 font-semibold mb-3">
            Jinsharnam Media Store
          </h1>
          <p className="text-amber-50 text-lg mb-6">
            Explore spiritual books, divine calendars & peaceful posters.
          </p>
          <a
            href="#products"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Filter + Search */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap justify-center gap-3">
            {["All", "Book", "Calendar", "Poster"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full border text-sm transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white shadow"
                    : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-amber-200 rounded-full px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center text-amber-700">
              No products found.
            </p>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="border rounded-2xl bg-gradient-to-br from-white to-amber-50/40 shadow-sm hover:shadow-xl transition-all p-4"
              >
                <Link href={`/store/${p.id}`}>
                  <img
                    src={p.imageUrl || "/images/default.jpg"}
                    alt={p.title}
                    className="rounded-xl w-full h-48 object-cover mb-3 hover:opacity-90 transition"
                  />
                </Link>

                <h3 className="font-serif text-lg text-amber-800 font-medium text-center">
                  {p.title}
                </h3>
                <p className="text-center text-amber-700 font-semibold mt-1">
                  ₹ {(p.priceCents / 100).toFixed(2)}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => addToCart(p)}
                    className="flex-1 rounded-full bg-amber-600 text-white py-2 text-sm hover:bg-amber-700 transition"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/store/${p.id}`}
                    className="flex-1 text-center rounded-full border border-amber-600 text-amber-700 py-2 text-sm hover:bg-amber-50 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-amber-800">Your Cart</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-amber-600"
          >
            ✕
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty</p>
          ) : (
            cart.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center mb-4 border-b pb-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.title}</p>
                  <div className="flex items-center mt-1 gap-2">
                    <button
                      onClick={() => decreaseQty(p.id)}
                      className="px-2 py-0.5 bg-amber-100 rounded hover:bg-amber-200 text-amber-800 font-semibold"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium">{p.qty}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="px-2 py-0.5 bg-amber-100 rounded hover:bg-amber-200 text-amber-800 font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-700 font-semibold">
                    ₹ {((p.priceCents * p.qty) / 100).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(p.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Payment Method
              </p>
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                  />
                  <span>Online Payment (Razorpay)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <p className="text-right text-lg font-semibold text-amber-800 mb-1">
              Total: ₹ {(totalAmount / 100).toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              className="w-full rounded-full bg-amber-600 text-white py-2 hover:bg-amber-700 transition"
            >
              {paymentMethod === "COD"
                ? "Place COD Order"
                : "Checkout with Razorpay"}
            </button>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-20 right-6 bg-amber-600 text-white rounded-full p-4 shadow-lg hover:bg-amber-700 transition z-[60]"
      >
        🛒 ({cart.reduce((s, i) => s + i.qty, 0)})
      </button>
    </main>
  );
}
