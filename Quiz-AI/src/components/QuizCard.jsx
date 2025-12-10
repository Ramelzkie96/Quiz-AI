import React, { useState } from "react";

const QuizCard = ({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedAnswer,
  category,          // 👈 NEW: category from parent
  difficulty,        // 👈 NEW: difficulty from parent
  onSelect,
  onNext,
  onBack,
  onSubmit
}) => {
  const [shakeEffect, setShakeEffect] = useState(false);

  const handleNextOrSubmit = () => {
    if (!selectedAnswer) {
      setShakeEffect(true);
      setTimeout(() => setShakeEffect(false), 600);
      return;
    }

    if (questionNumber === totalQuestions) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm font-semibold text-gray-600">
        
        <p>
          Category: <span className="text-green-600">{category}</span>
        </p>

        <p>
          Difficulty: <span className="text-green-600 capitalize">{difficulty}</span>
        </p>


        <p>
          Question <span className="text-green-600">{questionNumber}</span>/{totalQuestions}
        </p>
      </div>

      {/* Question Text */}
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">
        {question}
      </h2>

      {/* Options */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition 
        ${shakeEffect ? "animate-shake" : ""}`}
      >
        {options?.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={index}
              onClick={() => onSelect(opt)}
              className={`cursor-pointer transition rounded-xl shadow p-4 font-medium text-center transform 
              ${isSelected 
                ? "bg-green-500 text-white border-2 border-green-700"
                : "bg-green-50 text-green-800 hover:bg-green-100"} 
              ${shakeEffect ? "border-2 border-red-500 shadow-red-glow" : ""}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-300 transition"
        >
          ⬅ Back
        </button>

        <button
          onClick={handleNextOrSubmit}
          className={`px-6 py-2 cursor-pointer font-semibold rounded-xl shadow transition 
          bg-green-500 hover:bg-green-600 text-white`}
        >
          {questionNumber === totalQuestions ? "Submit ✔" : "Next ➡"}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
