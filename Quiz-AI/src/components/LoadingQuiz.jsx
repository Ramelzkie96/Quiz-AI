import React from "react";

const LoadingQuiz = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="flex flex-col items-center space-y-4">

        {/* Bouncing Dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
        </div>

        {/* Quiz Text Animation */}
        <p className="text-lg font-semibold text-green-700 animate-pulse">
          Loading Quiz...
        </p>
      </div>
    </div>
  );
};

export default LoadingQuiz;
