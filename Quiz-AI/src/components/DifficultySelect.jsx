import React, { useState } from "react";

const difficulties = [
  { level: "Easy", color: "bg-green-100 text-green-700", emoji: "😊" },
  { level: "Medium", color: "bg-yellow-100 text-yellow-700", emoji: "😎" },
  { level: "Hard", color: "bg-orange-100 text-orange-700", emoji: "🔥" },
  { level: "Expert", color: "bg-red-100 text-red-700", emoji: "💀" },
];

const DifficultySelect = ({ category, onSelect }) => {
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);

  const handleContinue = () => {
    if (!selectedDiff) return;
    onSelect({ level: selectedDiff, count: questionCount });
  };

  // Get the emoji for the currently selected difficulty
  const currentEmoji =
    difficulties.find((diff) => diff.level === selectedDiff)?.emoji || "🔥";

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      {/* Message */}
      <div className="text-center mb-2">
        <p className="text-sm text-green-700 font-medium">
          Category: <span className="font-bold">{category}</span>
        </p>
        <p className="text-gray-700 mt-2 text-lg font-semibold">
          Select difficulty {currentEmoji}
        </p>
      </div>

      {/* Difficulty Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {difficulties.map((diff) => (
          <button
            key={diff.level}
            onClick={() => setSelectedDiff(diff.level)}
            className={`rounded-2xl p-6 shadow-md border-2 transition transform hover:-translate-y-2 cursor-pointer flex flex-col items-center text-center ${
              diff.color
            } ${
              selectedDiff === diff.level
                ? "border-green-600 shadow-xl scale-105"
                : "border-transparent"
            }`}
          >
            <h3 className="text-xl font-bold">{diff.level}</h3>
          </button>
        ))}
      </div>

      {/* Question Amount Selector */}
      {selectedDiff && (
        <div className="bg-white shadow-md p-6 rounded-2xl max-w-xl mx-auto border border-green-200">
          <p className="text-center text-green-700 font-semibold text-lg mb-4">
            How many questions? 🧠
          </p>

          <div className="flex items-center gap-4 w-full">
            <input
              type="range"
              min="5"
              max="30"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="flex-1 accent-green-500 cursor-pointer"
            />
            <input
              type="number"
              min="5"
              max="30"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-20 border-2 border-green-300 text-center rounded-lg font-bold text-green-700"
            />
          </div>

          <p className="text-center text-gray-600 mt-2 text-sm">
            Choose between <b>5–30</b> questions
          </p>

          {/* Continue Button */}
          <div className="text-center mt-5">
            <button
              onClick={handleContinue}
              className="px-8 py-2 bg-green-500 text-white font-semibold rounded-xl shadow hover:bg-green-600 transition cursor-pointer"
            >
              Continue 👉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultySelect;
