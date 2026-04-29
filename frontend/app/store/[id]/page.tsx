"use client";

import { useCart } from "@/app/context/CartContext";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, ShoppingCart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

type Store = {
  id: number;
  name: string;
  address: string;
  deliveryTime: number;
  products: Product[];
};

const API_BASE_URL = "http://localhost:5000";

// ✅ IMAGE FUNCTION
const getImageByCategory = (category: string) => {
  const c = category?.toLowerCase();

  if (c.includes("fever"))
    return "https://cdn-icons-png.flaticon.com/512/2966/2966484.png";

  if (c.includes("vitamin"))
    return "https://cdn-icons-png.flaticon.com/512/2921/2921822.png";

  if (c.includes("baby"))
    return "https://cdn-icons-png.flaticon.com/512/3043/3043899.png";

  if (c.includes("health"))
    return "https://cdn-icons-png.flaticon.com/512/3209/3209265.png";

  return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
};

export default function StorePage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, totalItems } = useCart();

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStore = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stores/${id}`);
        if (!res.ok) throw new Error("Failed to fetch store");

        const data = await res.json();
        setStore(data.store);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const handleAddToCart = (product: Product) => {
    if (!store) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      storeId: store.id,
      storeName: store.name,
    });

    toast.success(`${product.name} added to cart 🛒`);

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 800);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <p className="text-gray-500">Loading store...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <p className="text-gray-500">Store not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            <ShoppingCart size={16} />
            Cart ({totalItems})
          </button>
        </div>
      </header>

      {/* STORE INFO */}
      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-8 shadow-xl"
          >
            <div className="mb-5 flex h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-blue-100 text-6xl">
              🏥
            </div>

            <h1 className="text-3xl font-extrabold">{store.name}</h1>

            <div className="mt-3 flex flex-col gap-2 text-gray-600 md:flex-row md:gap-6">
              <p className="flex items-center gap-2">
                <MapPin size={18} className="text-green-600" />
                {store.address}
              </p>

              <p className="flex items-center gap-2 text-green-600">
                <Clock size={18} />
                {store.deliveryTime} mins
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold">Available Medicines</h2>

        {store.products.length === 0 ? (
          <div className="rounded-xl border p-10 text-center text-gray-500">
            No products available.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {store.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-3xl bg-white p-5 shadow hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div className="mb-4 h-32 flex items-center justify-center rounded-xl bg-white">
                  <img
                    src={getImageByCategory(product.category)}
                    alt={product.name}
                    className="h-20 w-20 object-contain hover:scale-110 transition"
                  />
                </div>

                {/* CATEGORY */}
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {product.category}
                </span>

                <h3 className="mt-2 text-lg font-bold">{product.name}</h3>

                <p className="text-sm text-gray-500 mt-1">
                  {product.description}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.price}
                  </span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                  >
                    {addedId === product.id ? "Added ✓" : "Add"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}