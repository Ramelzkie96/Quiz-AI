import React, { useState } from "react";

const QuizCard = ({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedAnswer,
  onSelect,
  onNext,
  onBack,
  onSubmit // 👈 NEW
}) => {
  const [shakeEffect, setShakeEffect] = useState(false);

  const handleNextOrSubmit = () => {
    if (!selectedAnswer) {
      setShakeEffect(true);
      setTimeout(() => setShakeEffect(false), 600);
      return;
    }
    // If last question, submit instead of next
    if (questionNumber === totalQuestions) {
      onSubmit(); // 👈 call submit
    } else {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">

      <p className="text-center text-gray-500 font-semibold">
        Question <span className="text-green-600">{questionNumber}</span>/<span>{totalQuestions}</span>
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">
        {question}
      </h2>

      {/* OPTIONS */}
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

      {/* NAVIGATION BUTTONS */}
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
            ${questionNumber === totalQuestions 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-green-500 hover:bg-green-600 text-white"}`}
        >
          {questionNumber === totalQuestions ? "Submit ✔" : "Next ➡"}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
