"use client";

import { useEffect, useState } from "react";

type StoreListProps = {
  pincode?: string;
  isValid?: boolean;
  location?: {
    lat: number;
    lng: number;
  } | null;
};

type Store = {
  id: number;
  name: string;
  address: string;
  pincode: string;
  deliveryTime: number;
  image?: string;
};

const API_BASE_URL = "https://med-on-time.onrender.com";

export default function StoreList({ pincode = "201310", location }: StoreListProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stores?pincode=${pincode}`);
        const data = await res.json();

        setStores(data.stores || data || []);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [pincode]);

  if (loading) {
    return <p className="text-gray-500">Loading nearby pharmacies...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stores.map((store) => (
        <div
          key={store.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border"
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={
                store.image ||
                "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
              alt={store.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="text-lg font-bold text-white drop-shadow">
                {store.name}
              </h3>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm text-gray-600">{store.address}</p>

            {location && (
              <div className="text-xs text-blue-600 mt-2">
                📍 Showing stores near your location
              </div>
            )}

            <div className="mt-3 text-sm text-gray-600 flex gap-4">
              <span>⭐ 4.5</span>
              <span>⏱ {store.deliveryTime} min</span>
            </div>

            <div className="mt-2 text-xs font-medium text-green-600">
              ● Open
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Delivery within 2–3 km
            </div>

            <button className="mt-4 w-full py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition">
              Order from this store
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}