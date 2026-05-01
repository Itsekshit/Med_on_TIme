"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, LogOut } from "lucide-react";
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
  const [searchText, setSearchText] = useState("");
  const [isServiceable, setIsServiceable] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/");
  };

  const checkServiceability = async () => {
    if (!pincode) return alert("Enter pincode");

    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchText(value);

    if (!value.trim()) {
      setMedicines([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/medicines?search=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setMedicines(data.medicines || []);
    } catch {
      setMedicines([]);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <h1
            className="text-2xl font-extrabold text-green-600 cursor-pointer"
            onClick={() => router.push("/")}
          >
            MedOnTime
          </h1>

          <div className="hidden md:flex w-[400px]">
            <div className="flex items-center w-full border rounded-full px-4 py-2 bg-gray-100">
              <Search size={16} className="text-gray-500" />
              <input
                className="ml-2 w-full bg-transparent outline-none"
                placeholder="Search medicines or pharmacies..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/cart")}
              className="bg-black text-white px-4 py-2 rounded-xl flex gap-2 items-center"
            >
              <ShoppingCart size={16} />
              Cart
            </button>

            {user ? (
              <>
                <button
                  onClick={() => router.push("/account")}
                  className="border px-4 py-2 rounded-xl"
                >
                  Hi {user.name}
                </button>

                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="border px-4 py-2 rounded-xl"
                >
                  Login
                </button>

                <button
                  onClick={() => router.push("/register")}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

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
              onChange={(e) => setPincode(e.target.value)}
              className="border px-4 py-3 rounded-xl w-full"
            />

            <button
              onClick={checkServiceability}
              className="bg-green-600 text-white px-6 rounded-xl"
            >
              {loading ? "..." : "Check"}
            </button>
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

      {searchText && (
        <section className="max-w-7xl mx-auto px-6 pb-10">
          <h3 className="text-2xl font-bold mb-6">Search Results</h3>

          {medicines.length === 0 && filteredStores.length === 0 ? (
            <div className="text-center text-gray-500 bg-white rounded-2xl p-8 shadow">
              No results found
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <motion.div
                  key={`medicine-${medicine.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-5 shadow hover:shadow-xl"
                >
                  <div className="h-28 bg-green-50 rounded-2xl mb-4 flex items-center justify-center text-4xl">
                    💊
                  </div>

                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Medicine
                  </span>

                  <h4 className="font-bold text-lg mt-2">{medicine.name}</h4>

                  <p className="text-sm text-gray-500">
                    {medicine.description}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Store: {medicine.store?.name}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-green-600 font-bold">
                      ₹{medicine.price}
                    </span>

                    <button
                      onClick={() => router.push(`/store/${medicine.store?.id}`)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      View Store
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredStores.map((store, i) => (
                <motion.div
                  key={`store-${store.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => router.push(`/store/${store.id}`)}
                  className="bg-white rounded-3xl p-5 shadow hover:shadow-xl cursor-pointer"
                >
                  <div className="h-28 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center text-4xl">
                    🏥
                  </div>

                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Pharmacy
                  </span>

                  <h4 className="font-bold text-lg mt-2">{store.name}</h4>
                  <p className="text-sm text-gray-500">{store.address}</p>

                  <div className="flex justify-between mt-3 text-sm">
                    <span>{store.deliveryTime} mins</span>
                    <span className="text-green-600 font-bold">Open</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h3 className="text-2xl font-bold mb-6">Nearby Pharmacies</h3>

        {stores.length === 0 ? (
          <div className="text-center text-gray-500">
            Enter pincode to view stores
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredStores.map((store, i) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => router.push(`/store/${store.id}`)}
                className="bg-white rounded-3xl p-5 shadow hover:shadow-xl cursor-pointer"
              >
                <div className="h-32 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center text-4xl">
                  🏥
                </div>

                <h4 className="font-bold text-lg">{store.name}</h4>
                <p className="text-sm text-gray-500">{store.address}</p>

                <div className="flex justify-between mt-3 text-sm">
                  <span>{store.deliveryTime} mins</span>
                  <span className="text-green-600 font-bold">Open</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}