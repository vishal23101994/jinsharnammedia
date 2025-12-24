"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  category: "Book" | "Calendar" | "Poster";
  description?: string;
  priceCents: number;
  imageUrl?: string;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      console.log("Razorpay script already present (product page)");
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log(
        "Razorpay script loaded (product page), window.Razorpay =",
        window.Razorpay
      );
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script (product page)");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethod] = useState<"ONLINE">("ONLINE");

  useEffect(() => {
    if (params?.id) {
      fetch("/api/products")
        .then((r) => r.json())
        .then((data) => {
          const found = data.find((p: Product) => p.id === params.id);
          setProduct(found || null);
        });
    }
  }, [params?.id]);

  const handleBuy = async (product: Product) => {
    try {
      if (!session?.user) {
        window.dispatchEvent(
          new CustomEvent("open-auth-modal", { detail: { reason: "cart" } })
        );
        return;
      }

      // Save single-product cart so success page / COD can reuse it
      const singleCart = [{ ...product, qty: 1 }];
      localStorage.setItem("jinsharnam_cart", JSON.stringify(singleCart));

      // 💳 Online (Razorpay)
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert(
          "Unable to load payment system. Please check your internet and try again."
        );
        return;
      }

      if (typeof window.Razorpay !== "function") {
        console.error("Razorpay on window is not a function:", window.Razorpay);
        alert(
          "Payment system is not ready. Please refresh the page and try again."
        );
        return;
      }

      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: singleCart }),
      });

      const data = await res.json();
      console.log("PRODUCT PAGE ORDER RESPONSE:", data);

      if (!res.ok || !data?.id) {
        alert("Error creating order");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Jinsharnam Media",
        description: product.title,
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
              router.push("/store/success");
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
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong while starting payment.");
    }
  };

  if (!product)
    return (
      <p className="text-center py-20 text-gray-600">Loading product...</p>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800 py-10 px-6 relative">
      <section className="w-full bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-700 transition"
          >
            ← Back to Store
          </Link>
        </div>
      </section>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 bg-white shadow-md rounded-3xl p-6 mt-16">
        <div className="flex items-center justify-center">
          <img
            src={product.imageUrl || "/images/default.jpg"}
            alt={product.title}
            className="rounded-2xl w-full max-w-md object-cover shadow-sm"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-serif text-amber-800 font-semibold mb-3">
            {product.title}
          </h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl text-amber-700 font-semibold mb-6">
            ₹ {(product.priceCents / 100).toFixed(2)}
          </p>

          <div className="mb-4 text-sm text-gray-700">
            <p className="font-semibold mb-1">Payment Method</p>
            <label className="flex items-center gap-2">
              <input type="radio" checked readOnly />
              <span>Online Payment (Razorpay)</span>
            </label>
          </div>

          <button
            onClick={() => handleBuy(product)}
            className="w-full md:w-1/2 rounded-full bg-amber-600 text-white py-3 hover:bg-amber-700 transition-all"
          >
            Buy Now
          </button>

          <div className="mt-8 text-sm text-gray-500">
            <p>✅ Secure Payment via Razorpay</p>
            <p>🚚 Free Shipping on all orders</p>
            <p>📦 Delivery within 5–7 business days</p>
          </div>
        </div>
      </div>
    </section>
  );
}
