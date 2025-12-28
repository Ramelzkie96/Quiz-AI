import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import LoadingQuiz from "./LoadingQuiz";

const db = getFirestore();

const History = ({ user }) => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(true);

  useEffect(() => {
    const loadScores = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setScores(snap.data().scores || []);
      }
      setLoadingScores(false);
    };

    loadScores();
  }, [user]);

  return (
    <>
      <Header user={user} />
      <main className="p-6 pt-20 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 cursor-pointer flex items-center text-green-600 font-medium hover:text-green-800 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-green-700 mb-6">
          📜 Quiz History
        </h1>

        {loadingScores ? (
          <p className="text-gray-500">Loading leaderboard...</p>
        ) : scores.length === 0 ? (
          <p className="text-gray-500">No quiz history yet.</p>
        ) : (
          <div className="space-y-4">
            {scores.slice().reverse().map((quiz, index) => {
              const percentage = Math.round(
                (quiz.score / quiz.totalQuestions) * 100
              );

              return (
                <div
                  key={index}
                  className="p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      {quiz.category} • {quiz.difficulty}
                    </p>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        percentage < 50
                          ? "bg-red-100 text-red-700"
                          : percentage <= 75
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {percentage < 50
                        ? "Needs Improvement"
                        : percentage <= 75
                        ? "Good"
                        : "Passed"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Score: {quiz.score} / {quiz.totalQuestions} ({percentage}%)
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Taken on{" "}
                    {quiz.timestamp?.toDate().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default History;
