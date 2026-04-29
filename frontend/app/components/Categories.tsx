type CategoriesProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

export default function Categories({
  setSelectedCategory,
  selectedCategory,
}: CategoriesProps) {
  const categories = ["Healthcare"];

  return (
    <div className="flex gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            selectedCategory === category
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}