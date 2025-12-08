import React from "react";

const categories = [
  { icon: "🧑‍💻", title: "Programming", desc: "General coding concepts" },
  { icon: "🌐", title: "Web Development", desc: "HTML, CSS, JS, React" },
  { icon: "🔐", title: "Cybersecurity", desc: "Security basics & attacks" },
  { icon: "🤖", title: "AI & Machine Learning", desc: "Models, ethics, terms" },
];

const CategorySelect = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Message */}
      <div className="text-center mb-6">
        <p className="text-sm text-center mt-8 text-green-700 font-medium">
          Select a category below to generate quiz questions based on your choice:
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => onSelect(cat.title)}
            className="bg-white border border-green-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer flex flex-col items-center text-center hover:inset-shadow-sm inset-shadow-green-600/60"
          >
            <div className="text-5xl">{cat.icon}</div>
            <h3 className="text-xl font-bold text-green-700 mt-3">{cat.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelect;
