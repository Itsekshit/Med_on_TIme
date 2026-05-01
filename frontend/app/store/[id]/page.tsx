"use client";

import { useCart } from "@/app/context/CartContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getImageByCategory = (category: string) => {
  const c = category?.toLowerCase();

  if (c.includes("fever"))
    return "https://cdn-icons-png.flaticon.com/512/2966/2966484.png";
  if (c.includes("vitamin"))
    return "https://cdn-icons-png.flaticon.com/512/2921/2921822.png";
  if (c.includes("baby"))
    return "https://cdn-icons-png.flaticon.com/512/3043/3043899.png";
  if (c.includes("cold") || c.includes("cough"))
    return "https://cdn-icons-png.flaticon.com/512/2785/2785819.png";
  if (c.includes("health"))
    return "https://cdn-icons-png.flaticon.com/512/3209/3209265.png";

  return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
};

export default function StorePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const { addToCart, totalItems } = useCart();

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!id) return;

    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/stores/${String(id)}`);

        if (!res.ok) throw new Error("Failed to fetch store");

        const data = await res.json();
        setStore(data.store);
      } catch (error) {
        console.error("STORE FETCH ERROR:", error);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const categories = useMemo(() => {
    if (!store) return ["All"];
    return ["All", ...Array.from(new Set(store.products.map((p) => p.category)))];
  }, [store]);

  const filteredProducts = useMemo(() => {
    if (!store) return [];

    return store.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [store, search, selectedCategory]);

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f8fc]">
        <p className="text-gray-500">Store not found</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-xl bg-green-600 px-5 py-2 text-white"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#111827]">
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

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
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
              </div>

              <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                <Star size={16} fill="currentColor" />
                4.5 Trusted Pharmacy
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-2xl font-bold">Available Medicines</h2>

          <div className="flex items-center rounded-2xl border bg-white px-4 py-3 shadow-sm md:w-[360px]">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine..."
              className="ml-2 w-full outline-none"
            />
          </div>
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-3xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-blue-50">
                  <img
                    src={getImageByCategory(product.category)}
                    alt={product.name}
                    className="h-24 w-24 object-contain transition hover:scale-110"
                  />
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {product.category}
                </span>

                <h3 className="mt-3 text-lg font-bold">{product.name}</h3>

                <p className="mt-1 min-h-[40px] text-sm text-gray-500">
                  {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.price}
                  </span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
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