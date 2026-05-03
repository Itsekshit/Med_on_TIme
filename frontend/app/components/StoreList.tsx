"use client";

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
      id: 1,
      name: "Sharma Medical Store",
      distance: "1.2 km",
      rating: "4.5",
      time: "20 min",
      status: "Open",
      image:
        "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
    },
    {
      id: 2,
      name: "City Pharmacy",
      distance: "2.0 km",
      rating: "4.2",
      time: "25 min",
      status: "Open",
      image:
        "https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg",
    },
    {
      id: 3,
      name: "HealthPlus Store",
      distance: "1.8 km",
      rating: "4.6",
      time: "18 min",
      status: "Open",
      image:
        "https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg",
    },
    {
      id: 4,
      name: "Care Medical",
      distance: "2.5 km",
      rating: "4.1",
      time: "30 min",
      status: "Closed",
      image:
        "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stores.map((store) => (
        <div
          key={store.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border"
        >
          <div className="relative h-44 overflow-hidden bg-gray-100">
            <img
              src={store.image}
              alt={store.name}
              onError={(e) => {
                e.currentTarget.src = "/default-pharmacy.jpg";
              }}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end gap-3">
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