const QuizResult = ({ score, totalQuestions, onViewAnswers, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  let message = "";
  let color = "";

  if (percentage < 75) {
    message =
      "💪 Keep going! Review the answers and try again — practice makes progress.";
    color = "text-red-600";
  } else if (percentage < 90) {
    message =
      "👏 Great job! You passed the quiz. A bit more practice and you'll master this topic!";
    color = "text-yellow-600";
  } else {
    message =
      "🔥 Excellent work! You really know your stuff. Keep challenging yourself!";
    color = "text-green-600";
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg text-center space-y-4">
      <h1 className="text-3xl font-bold text-green-700">🎉 Quiz Completed!</h1>

      <p className="text-xl font-semibold">
        Score: {score} / {totalQuestions}
      </p>

      <p className="text-lg font-bold">{percentage}%</p>

      <p className={`text-md font-medium ${color}`}>{message}</p>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={onViewAnswers}
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold"
        >
          Review Answers
        </button>

        <button
  onClick={() => {
    // Option 1: Refresh current page
    // window.location.reload();

    // Option 2: Go to homepage and refresh
    window.location.href = "/";
  }}
  className="px-5 py-2 cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold"
>
  Back Homepage
</button>

      </div>
    </div>
  );
};

export default QuizResult;
