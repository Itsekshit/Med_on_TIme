"use client";

type StoreListProps = {
  pincode?: string;
  isValid?: boolean;
  location?: {
    lat: number;
    lng: number;
  } | null;
};

const fallbackImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
    <rect width="800" height="400" fill="#f8fafc"/>
    <rect x="80" y="120" width="640" height="220" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="6"/>
    <rect x="80" y="90" width="640" height="80" rx="20" fill="#ef4444"/>
    <text x="400" y="142" font-size="42" font-family="Arial" font-weight="bold" fill="white" text-anchor="middle">MEDICAL STORE</text>
    <circle cx="400" cy="235" r="42" fill="#16a34a"/>
    <rect x="390" y="205" width="20" height="60" fill="white"/>
    <rect x="370" y="225" width="60" height="20" fill="white"/>
  </svg>
`);

export default function StoreList({ location }: StoreListProps) {
  const stores = [
    { id: 1, name: "Apollo Pharmacy", distance: "1.2 km", rating: "4.5", time: "20 min", status: "Open", image: "" },
    { id: 2, name: "MedPlus Pharmacy", distance: "2.0 km", rating: "4.2", time: "25 min", status: "Open", image: "" },
    { id: 3, name: "Wellness Forever", distance: "1.8 km", rating: "4.6", time: "18 min", status: "Open", image: "" },
    { id: 4, name: "Guardian Pharmacy", distance: "2.5 km", rating: "4.1", time: "30 min", status: "Closed", image: "" },
    { id: 5, name: "Netmeds Store", distance: "1.6 km", rating: "4.4", time: "22 min", status: "Open", image: "" },
    { id: 6, name: "HealthCare Medical", distance: "2.2 km", rating: "4.3", time: "28 min", status: "Open", image: "" },
    { id: 7, name: "LifeCare Pharmacy", distance: "1.9 km", rating: "4.5", time: "24 min", status: "Open", image: "" },
    { id: 8, name: "CityMed Store", distance: "2.7 km", rating: "4.0", time: "32 min", status: "Closed", image: "" },
    { id: 9, name: "CarePlus Pharmacy", distance: "1.4 km", rating: "4.7", time: "19 min", status: "Open", image: "" },
    { id: 10, name: "24x7 Medical Store", distance: "1.1 km", rating: "4.8", time: "15 min", status: "Open", image: "" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stores.map((store) => (
        <div
          key={store.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border"
        >
          {/* IMAGE */}
          <div className="relative h-44 overflow-hidden bg-gray-100">
            <img
              src={store.image || fallbackImage}
              alt={store.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              className="w-full h-full object-cover"
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

          {/* DETAILS */}
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