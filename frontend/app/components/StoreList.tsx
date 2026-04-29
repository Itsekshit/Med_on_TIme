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
    },
    {
      name: "City Pharmacy",
      distance: "2.0 km",
      rating: "4.2",
      time: "25 min",
      status: "Open",
    },
    {
      name: "HealthPlus Store",
      distance: "1.8 km",
      rating: "4.6",
      time: "18 min",
      status: "Open",
    },
    {
      name: "Care Medical",
      distance: "2.5 km",
      rating: "4.1",
      time: "30 min",
      status: "Closed",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stores.map((store, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border"
        >
          <div className="h-40 bg-gray-200 flex items-center justify-center text-4xl">
            🏥
          </div>

          <div className="p-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {store.name}
              </h3>

              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {store.distance}
              </span>
            </div>

            {location && (
              <div className="text-xs text-blue-600 mt-1">
                📍 Showing stores near your location
              </div>
            )}

            <div className="mt-2 text-sm text-gray-600 flex gap-4">
              <span>⭐ {store.rating}</span>
              <span>⏱ {store.time}</span>
            </div>

            <div
              className={`mt-2 text-xs font-medium ${
                store.status === "Open" ? "text-green-600" : "text-red-500"
              }`}
            >
              ● {store.status}
            </div>

            <div className="mt-2 text-xs text-gray-500">
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