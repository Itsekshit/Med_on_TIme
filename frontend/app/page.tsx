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

  const handleSearch = async (value: string) => {
    if (!isServiceable) {
      alert("Enter pincode first");
      return;
    }

    setSearchText(value);

    if (!value.trim()) {
      setMedicines([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/medicines?search=${value}`
      );
      const data = await res.json();

      const nearby = (data.medicines || []).filter(
        (m: any) => m.store?.pincode === pincode
      );

      setMedicines(nearby);
    } catch {
      setMedicines([]);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* 🔥 NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          
          <h1
            className="text-2xl font-extrabold text-green-600 cursor-pointer"
            onClick={() => router.push("/")}
          >
            MedOnTime
          </h1>

          {/* 🔥 SEARCH (TOP ONLY) */}
          <div className="relative hidden md:flex w-[400px]">
            <div className="flex items-center w-full border rounded-full px-4 py-2 bg-gray-100">
              <Search size={16} className="text-gray-500" />
              <input
                className="ml-2 w-full bg-transparent outline-none"
                placeholder={
                  isServiceable
                    ? "Search medicines or pharmacies..."
                    : "Enter pincode first"
                }
                disabled={!isServiceable}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* 🔥 DROPDOWN */}
            {isServiceable && searchText && (
              <div className="absolute top-12 left-0 w-full bg-white rounded-2xl shadow-xl border z-50 max-h-[400px] overflow-y-auto p-2">
                
                {medicines.length === 0 && filteredStores.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No results found
                  </p>
                ) : (
                  <>
                    {medicines.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => router.push(`/store/${m.store.id}`)}
                        className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-xl cursor-pointer"
                      >
                        <div className="bg-green-100 p-2 rounded-lg">💊</div>
                        <div>
                          <p className="font-bold">{m.name}</p>
                          <p className="text-xs text-gray-500">
                            {m.store.name} • ₹{m.price}
                          </p>
                        </div>
                      </div>
                    ))}

                    {filteredStores.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => router.push(`/store/${s.id}`)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer"
                      >
                        <div className="bg-blue-100 p-2 rounded-lg">🏥</div>
                        <div>
                          <p className="font-bold">{s.name}</p>
                          <p className="text-xs text-gray-500">
                            {s.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* 🔥 RIGHT */}
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
                  className="bg-red-500 text-white px-4 py-2 rounded-xl flex gap-2"
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

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-extrabold">
          Medicines delivered in{" "}
          <span className="text-green-600">30 mins</span>
        </h2>

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
      </section>

      {/* STORES */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h3 className="text-2xl font-bold mb-6">Nearby Pharmacies</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => router.push(`/store/${store.id}`)}
              className="bg-white rounded-3xl p-5 shadow hover:shadow-xl cursor-pointer"
            >
              <div className="h-32 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center text-4xl">
                🏥
              </div>

              <h4 className="font-bold text-lg">{store.name}</h4>
              <p className="text-sm text-gray-500">{store.address}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}