import React, { useState } from "react";

const QuizCard = ({ questionNumber, totalQuestions, question, options, onSelect, onNext, onBack }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSelect = (opt) => {
    setSelectedAnswer(opt);
    onSelect(opt);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">

      <p className="text-center text-gray-500 font-semibold">
        Question <span className="text-green-600">{questionNumber}</span>/<span>{totalQuestions}</span>
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">
        {question}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options?.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={index}
              onClick={() => handleSelect(opt)}
              className={`cursor-pointer transition rounded-xl shadow p-4 font-medium text-center transform hover:-translate-y-1
                ${isSelected 
                  ? "bg-green-500 text-white" 
                  : "bg-green-50 text-green-800 hover:bg-green-100"}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-300 transition">
          ⬅ Back
        </button>

        <button onClick={onNext} className="px-6 py-2 cursor-pointer bg-green-500 text-white font-semibold rounded-xl shadow hover:bg-green-600 transition">
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
