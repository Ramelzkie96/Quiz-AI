// QuizAnswers.jsx
import React from "react";

const QuizAnswers = ({ questions, answers, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">

      <h1 className="text-3xl font-bold text-blue-700 text-center">
        📄 Review Your Answers
      </h1>

      {questions.map((q, index) => {
        const userAnswer = answers[index];
        const correctAnswer = q.answer;

        const isCorrect = userAnswer === correctAnswer;

        return (
          <div
            key={index}
            className="p-4 border rounded-xl shadow-sm bg-gray-50 space-y-2"
          >
            <h2 className="font-semibold text-lg">
              {index + 1}. {q.question}
            </h2>

            {/* User Selected Answer */}
            <p
              className={`p-2 rounded-lg font-medium ${
                isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              Your Answer: {userAnswer || "No answer"}
            </p>

            {/* Correct Answer */}
            {!isCorrect && (
              <p className="p-2 rounded-lg bg-green-100 text-green-800 font-medium">
                Correct Answer: {correctAnswer}
              </p>
            )}
          </div>
        );
      })}

      <div className="text-center">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl cursor-pointer shadow"
        >
          Back to Result
        </button>
      </div>
    </div>
  );
};

export default QuizAnswers;
