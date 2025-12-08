import React from "react";

const NewUser = ({ stats, onStart }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-full max-w-3xl p-8 rounded-2xl shadow-md bg-white inset-shadow-sm inset-shadow-green-600/60">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-green-700 animate-pulse">
            Ready to challenge yourself?
          </p>
          <p className="text-lg text-gray-700">
            Your first quiz awaits! Test your knowledge and start leveling up! 🚀
          </p>
          <button
            onClick={onStart}
            className="mt-6 px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition cursor-pointer"
          >
            Start Quiz 🎯
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
