type StoreListProps = {
  pincode?: string;
  isValid?: boolean;
  location?: {
    lat: number;
    lng: number;
  } | null;
};

export default function StoreList({ location }: StoreListProps) {
  const stores = [
    {
      name: "Sharma Medical Store",
      distance: "1.2 km",
      rating: "4.5",
      time: "20 min",
      status: "Open",
      image:
        "https://images.unsplash.com/photo-1580281657527-47e8d1cfa5c7?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "City Pharmacy",
      distance: "2.0 km",
      rating: "4.2",
      time: "25 min",
      status: "Open",
      image:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "HealthPlus Store",
      distance: "1.8 km",
      rating: "4.6",
      time: "18 min",
      status: "Open",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Care Medical",
      distance: "2.5 km",
      rating: "4.1",
      time: "30 min",
      status: "Closed",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stores.map((store, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border"
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
              <h3 className="text-lg font-bold text-white drop-shadow">
                {store.name}
              </h3>

              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  store.status === "Open"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {store.status}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 flex gap-4">
                <span>⭐ {store.rating}</span>
                <span>⏱ {store.time}</span>
              </div>

              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {store.distance}
              </span>
            </div>

            {location && (
              <div className="text-xs text-blue-600 mt-3">
                📍 Showing stores near your location
              </div>
            )}

            <div className="mt-3 text-xs text-gray-500">
              Delivery within 2–3 km
            </div>

            <button
              disabled={store.status === "Closed"}
              className={`mt-4 w-full py-2 rounded-lg font-medium transition ${
                store.status === "Open"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {store.status === "Open"
                ? "Order from this store"
                : "Store Closed"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}