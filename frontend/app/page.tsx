"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const router = useRouter();

  const [pincode, setPincode] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isServiceable, setIsServiceable] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!isServiceable || !searchText.trim()) {
      setMedicines([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/api/medicines?search=${encodeURIComponent(
            searchText
          )}`
        );

        const data = await res.json();

        const nearbyMedicines = (data.medicines || []).filter(
          (m: any) => m.store?.pincode === pincode
        );

        setMedicines(nearbyMedicines);
      } catch {
        setMedicines([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText, isServiceable, pincode]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/");
  };

  const checkServiceability = async () => {
    if (!pincode) return alert("Enter pincode");

    setLoading(true);
    setSearchText("");
    setMedicines([]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/serviceability/${pincode}`);
      const data = await res.json();

      if (!data.serviceable) {
        setMessage("Not serviceable");
        setStores([]);
        setIsServiceable(false);
        return;
      }

      setIsServiceable(true);
      setMessage("Delivery available");

      const storeRes = await fetch(
        `${API_BASE_URL}/api/stores?pincode=${pincode}`
      );
      const storeData = await storeRes.json();

      setStores(storeData.stores || []);
    } catch {
      setMessage("Server error");
      setIsServiceable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    if (!isServiceable) return;
    setSearchText(value);
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const visibleStores = searchText ? filteredStores : stores;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <h1
            className="text-2xl font-extrabold text-green-600 cursor-pointer"
            onClick={() => router.push("/")}
          >
            MedOnTime
          </h1>

          {/* PREMIUM TOP SEARCH */}
          <div className="relative hidden md:flex w-[430px]">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="flex items-center w-full border rounded-full px-4 py-2 bg-gray-100 focus-within:bg-white focus-within:shadow-lg transition"
            >
              <Search size={16} className="text-gray-500" />

              <input
                className="ml-2 w-full bg-transparent outline-none disabled:cursor-not-allowed"
                placeholder={
                  isServiceable
                    ? "Search medicines or pharmacies..."
                    : "Enter pincode first"
                }
                disabled={!isServiceable}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {searchLoading && (
                <Loader2 size={16} className="animate-spin text-green-600" />
              )}
            </motion.div>

            <AnimatePresence>
              {isServiceable && searchText && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-12 z-50 max-h-[420px] w-full overflow-y-auto rounded-2xl border bg-white p-2 shadow-2xl"
                >
                  {searchLoading ? (
                    <div className="flex items-center justify-center gap-2 py-5 text-sm text-gray-500">
                      <Loader2 size={16} className="animate-spin" />
                      Searching...
                    </div>
                  ) : medicines.length === 0 && filteredStores.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                      No results found
                    </p>
                  ) : (
                    <>
                      {medicines.map((medicine) => (
                        <motion.div
                          key={`medicine-${medicine.id}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            router.push(`/store/${medicine.store?.id}`)
                          }
                          className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-green-50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                            💊
                          </div>

                          <div className="flex-1">
                            <h4 className="text-sm font-bold">
                              {medicine.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {medicine.store?.name} • ₹{medicine.price}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {filteredStores.map((store) => (
                        <motion.div
                          key={`store-${store.id}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push(`/store/${store.id}`)}
                          className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-blue-50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                            🏥
                          </div>

                          <div className="flex-1">
                            <h4 className="text-sm font-bold">{store.name}</h4>
                            <p className="text-xs text-gray-500">
                              {store.address} • {store.deliveryTime} mins
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT NAV */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/cart")}
              className="bg-black text-white px-4 py-2 rounded-xl flex gap-2 items-center"
            >
              <ShoppingCart size={16} />
              Cart
            </motion.button>

            {user ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/account")}
                  className="border px-4 py-2 rounded-xl"
                >
                  Hi {user.name}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/login")}
                  className="border px-4 py-2 rounded-xl"
                >
                  Login
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/register")}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-5xl font-extrabold leading-tight">
            Medicines delivered in{" "}
            <span className="text-green-600">30 mins</span>
          </h2>

          <p className="text-gray-500 mt-4">
            Order from nearby pharmacies instantly.
          </p>

          <div className="flex gap-3 mt-6">
            <input
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setIsServiceable(false);
                setStores([]);
                setMedicines([]);
                setSearchText("");
                setMessage("");
              }}
              className="border px-4 py-3 rounded-xl w-full"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={checkServiceability}
              className="bg-green-600 text-white px-6 rounded-xl"
            >
              {loading ? "..." : "Check"}
            </motion.button>
          </div>

          {message && <p className="mt-3 text-sm">{message}</p>}
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          <h3 className="text-xl font-bold mb-4">Why MedOnTime?</h3>

          <ul className="space-y-3 text-gray-600">
            <li>⚡ 30 min delivery</li>
            <li>🏥 Trusted pharmacies</li>
            <li>💊 Genuine medicines</li>
          </ul>
        </motion.div>
      </section>

      {/* STORES */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h3 className="text-2xl font-bold mb-6">Nearby Pharmacies</h3>

        {stores.length === 0 ? (
          <div className="text-center text-gray-500">
            Enter pincode to view stores
          </div>
        ) : visibleStores.length === 0 ? (
          <div className="text-center text-gray-500">
            No pharmacies found
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {visibleStores.map((store, i) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/store/${store.id}`)}
                className="bg-white rounded-3xl p-5 shadow hover:shadow-xl cursor-pointer transition"
              >
                <div className="relative h-36 rounded-2xl mb-4 overflow-hidden bg-green-50">
                  <img
                    src={`https://source.unsplash.com/400x250/?pharmacy,medical,store&sig=${store.id}`}
                    alt={store.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />

                  <span className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-600 shadow">
                    Open
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-lg">{store.name}</h4>
                    <p className="text-sm text-gray-500">{store.address}</p>
                  </div>

                  <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                    ⭐ 4.{store.id % 5}
                  </span>
                </div>

                <div className="flex justify-between mt-3 text-sm">
                  <span>{store.deliveryTime} mins</span>
                  <span className="text-green-600 font-bold">Open Now</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}