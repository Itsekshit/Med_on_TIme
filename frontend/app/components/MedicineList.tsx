type MedicineType = {
  name: string;
  price: number;
};

type MedicineListProps = {
  addToCart: (item: MedicineType) => void;
  searchQuery: string;
};

export default function MedicineList({
  addToCart,
  searchQuery,
}: MedicineListProps) {
  const medicines: MedicineType[] = [
    { name: "Paracetamol", price: 50 },
    { name: "Dolo 650", price: 60 },
    { name: "Crocin", price: 40 },
    { name: "Cough Syrup", price: 120 },
    { name: "Aspirin", price: 35 },
    { name: "Vitamin C", price: 80 },
    { name: "Amoxicillin", price: 110 },
    { name: "Ibuprofen", price: 75 },
  ];

  const filteredMedicines = searchQuery
    ? medicines.filter((med) =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : medicines;

  return (
    <div>
      {filteredMedicines.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900">
            No medicine found
          </h3>
          <p className="text-gray-600 mt-2">
            Try searching with another medicine name.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {filteredMedicines.map((med, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-3xl">
                💊
              </div>

              <h3 className="text-gray-900 font-medium">{med.name}</h3>
              <p className="text-red-500 font-semibold">₹{med.price}</p>

              <button
                onClick={() => addToCart(med)}
                className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}