"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StoreList({ pincode, isValid }: any) {
  const [stores, setStores] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchShop, setSearchShop] = useState("");
  const [searchMed, setSearchMed] = useState("");

  const router = useRouter();

  // 🔄 Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      if (pincode !== "201310" || !isValid) {
        setStores([]);
        return;
      }

      const res = await fetch("http://localhost:4000/stores");
      const data = await res.json();

      const filtered = data.filter(
        (store: any) => store.distance <= 3
      );

      setStores(filtered);
    };

    fetchStores();
  }, [pincode, isValid]);

  // 🔄 Load cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // 🛒 ADD
  const addToCart = (med: any) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      ...med,
      cartId: Date.now(),
    };

    const updatedCart = [...existingCart, newItem];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // ❌ REMOVE
  const removeFromCart = (cartId: number) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const updatedCart = existingCart.filter(
      (item: any) => item.cartId !== cartId
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // 💳 CHECKOUT
  const handleCheckout = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Please login first 🔐");
      router.push("/login");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="text-center">

      {/* 🔍 SEARCH */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="text"
          placeholder="Search Shop 🔍"
          value={searchShop}
          onChange={(e) => setSearchShop(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="text"
          placeholder="Search Medicine 💊"
          value={searchMed}
          onChange={(e) => setSearchMed(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        />
      </div>

      {/* 🏪 STORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stores.length > 0 ? (
          stores
            .filter((store: any) =>
              store.name.toLowerCase().includes(searchShop.toLowerCase())
            )
            .map((store: any) => (
              <div
                key={store.id}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800"
              >
                <h3 className="text-xl font-bold text-blue-400">
                  {store.name}
                </h3>

                <p className="text-gray-400 mb-4">
                  Distance: {store.distance} km
                </p>

                {/* 💊 MEDICINES */}
                <div className="space-y-2">
                  {store.medicines
                    ?.filter((med: any) =>
                      med.name
                        .toLowerCase()
                        .includes(searchMed.toLowerCase())
                    )
                    .map((med: any) => (
                      <div
                        key={`${store.id}-${med.id}`}
                        className="flex justify-between items-center bg-gray-800 p-2 rounded"
                      >
                        <span>{med.name}</span>

                        <div className="flex items-center gap-2">
                          <span>₹{med.price}</span>

                          <button
                            onClick={() => addToCart(med)}
                            className="bg-blue-600 px-2 py-1 rounded text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        ) : (
          isValid && pincode === "201310" && (
            <p className="text-gray-400">No stores found</p>
          )
        )}
      </div>

      {/* 🛒 CART */}
      {cart.length > 0 && (
        <div className="mt-10 bg-gray-900 p-5 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-blue-400 mb-4">
            🛒 Cart Items ({cart.length})
          </h2>

          <div className="space-y-3">
            {cart.map((item: any) => (
              <div
                key={item.cartId}
                className="flex justify-between items-center bg-gray-800 p-3 rounded"
              >
                <span>
                  {item.name} - ₹{item.price}
                </span>

                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            className="mt-5 bg-green-600 px-5 py-2 rounded"
          >
            Proceed to Checkout 💳
          </button>
        </div>
      )}
    </div>
  );
}