export default function Categories({ setSelectedCategory, selectedCategory }) {
  const categories = ["Healthcare"];

  return (
    <div className="mt-12">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Categories
        </h2>

        <span className="text-sm text-gray-500">
          Local Delivery
        </span>
      </div>

      {/* CATEGORY CARD */}
      <div className="flex justify-start">
        {categories.map((item) => {
          const isActive = selectedCategory === item;

          return (
            <div
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl cursor-pointer border transition
                ${
                  isActive
                    ? "bg-red-500 text-white shadow-md border-red-500"
                    : "bg-white hover:bg-gray-100 border-gray-200 shadow-sm"
                }
              `}
            >
              {/* ICON */}
              <span className="text-2xl">💊</span>

              {/* TEXT */}
              <h3 className="font-medium text-lg">{item}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}