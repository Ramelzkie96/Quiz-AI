import React from "react";

const CountdownScreen = ({ category, difficulty, count, countdown }) => {
  return (
    <div className="text-center mt-10 space-y-6">
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        {/* Category Card */}
        <div className="bg-green-100 rounded-2xl shadow-md p-6 w-48 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase">Category</p>
          <p className="text-xl font-bold text-green-700 mt-2">{category}</p>
        </div>

        {/* Difficulty Card */}
        <div className="bg-green-100 rounded-2xl shadow-md p-6 w-48 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase">Difficulty</p>
          <p className="text-xl font-bold text-green-700 mt-2">{difficulty}</p>
        </div>

        {/* Question Count Card */}
        <div className="bg-green-100 rounded-2xl shadow-md p-6 w-48 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase">Questions</p>
          <p className="text-xl font-bold text-green-700 mt-2">{count}</p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mt-6">
        <p className="text-xl font-medium text-gray-700">Quiz will start in...</p>
        <p className="text-6xl font-extrabold text-green-500 animate-pulse">
          {countdown}
        </p>
      </div>
    </div>
  );
};

export default CountdownScreen;
