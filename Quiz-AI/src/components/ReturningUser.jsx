const ReturningUser = ({ stats, lastQuiz, onStart }) => {
  const percentage = Math.round(
    (lastQuiz.score / lastQuiz.totalQuestions) * 100
  );

  // Determine color and label based on percentage
  const getColorClass = (percent, type) => {
    if (percent < 50) return type === "bg" ? "bg-red-500" : "text-red-600";
    if (percent <= 75) return type === "bg" ? "bg-yellow-400" : "text-yellow-600";
    return type === "bg" ? "bg-green-500" : "text-green-600";
  };

  const badgeText =
    percentage < 50 ? "NEEDS IMPROVEMENT" : percentage <= 75 ? "GOOD" : "PASSED";

  const badgeColorClass =
    percentage < 50
      ? "bg-red-100 text-red-700"
      : percentage <= 75
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="flex justify-center mb-8">
      <div className="w-full max-w-3xl p-8 rounded-2xl shadow-lg bg-white space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            👋 Welcome back!
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here’s a quick summary of your latest performance
          </p>
        </div>

        {/* Last Quiz Card */}
        <div className="p-6 rounded-2xl border bg-gradient-to-br from-gray-50 to-white shadow-sm space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">🧠 Last Quiz</h3>

            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${badgeColorClass}`}>
              {badgeText}
            </span>
          </div>

          {/* Category + Difficulty */}
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              {lastQuiz.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
              {lastQuiz.difficulty}
            </span>
          </div>

          {/* Score */}
          <div className="space-y-2">
            <p className="text-4xl font-bold text-gray-800">
              {percentage}%{" "}
              <span className="text-base font-medium text-gray-500">correct</span>
            </p>
            <p className="text-sm text-gray-500">
              You answered {lastQuiz.score} out of {lastQuiz.totalQuestions} questions correctly
            </p>

            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className={`${getColorClass(percentage, "bg")} h-full`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Motivation */}
          <p className={`font-medium ${getColorClass(percentage, "text")}`}>
            {percentage < 50
              ? "💪 Don’t worry — review your answers and try again!"
              : percentage <= 75
              ? "👍 Good job! Keep improving."
              : "🎉 Excellent work! You’re on the right track."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-gray-50 shadow-sm">
            <p className="text-2xl font-bold text-gray-800">
              {stats.completedQuizzes}
            </p>
            <p className="text-xs text-gray-500 mt-1">Quizzes Taken</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 shadow-sm">
            <p className="text-2xl font-bold text-gray-800">
              {stats.averageScore}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Average Score</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 shadow-sm">
            <p className="text-lg font-bold text-gray-800">
              {stats.bestCategory}
            </p>
            <p className="text-xs text-gray-500 mt-1">Best Category</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full cursor-pointer mt-2 px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 hover:scale-[1.01] transition"
        >
          Start New Quiz 🚀
        </button>

      </div>
    </div>
  );
};

export default ReturningUser;
