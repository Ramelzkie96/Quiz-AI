// QuizResult.jsx
import React from "react";

const QuizResult = ({ score, totalQuestions, onViewAnswers, onRestart }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg text-center space-y-6">

      <h1 className="text-4xl font-bold text-green-700">🎉 Congratulations!</h1>

      <p className="text-xl font-semibold text-gray-700">
        You scored <span className="text-green-600">{score}</span> out of {totalQuestions}!
      </p>

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={onViewAnswers}
          className="px-6 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition"
        >
          View Answers 📄
        </button>

        <button
          onClick={onRestart}
          className="px-6 py-2 cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow transition"
        >
          Restart 🔄
        </button>
      </div>

    </div>
  );
};

export default QuizResult;
