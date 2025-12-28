import React, { useEffect, useState } from "react";
import Header from "./Header";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const db = getFirestore();

const Leaderboard = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeaderboard = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.scores || data.scores.length === 0) return;

        // ---- CALCULATIONS ----
        let totalScore = 0;
        let totalQuestions = 0;

        const categoryStats = {};
        const difficultyStats = {};

        data.scores.forEach(q => {
          totalScore += q.score;
          totalQuestions += q.totalQuestions;

          // Category
          if (!categoryStats[q.category]) {
            categoryStats[q.category] = { score: 0, total: 0 };
          }
          categoryStats[q.category].score += q.score;
          categoryStats[q.category].total += q.totalQuestions;

          // Difficulty
          if (!difficultyStats[q.difficulty]) {
            difficultyStats[q.difficulty] = { score: 0, total: 0 };
          }
          difficultyStats[q.difficulty].score += q.score;
          difficultyStats[q.difficulty].total += q.totalQuestions;
        });

        const avgScore = Math.round(
            (data.scores.reduce((sum, q) => sum + q.score / q.totalQuestions, 0) /
                data.scores.length) *
                100
            );

        const bestCategory = Object.entries(categoryStats)
          .map(([key, val]) => ({
            key,
            percent: val.score / val.total
          }))
          .sort((a, b) => b.percent - a.percent)[0]?.key;

        const bestDifficulty = Object.entries(difficultyStats)
          .map(([key, val]) => ({
            key,
            percent: val.score / val.total
          }))
          .sort((a, b) => b.percent - a.percent)[0]?.key;

        users.push({
            id: doc.id,
            name: data.displayName || "Anonymous",
            photoURL: data.photoURL || null,   // ✅ ADD THIS
            avgScore,
            bestCategory,
            bestDifficulty,
            quizzes: data.scores.length
            });

      });

      // SORT BY AVG SCORE DESC
      users.sort((a, b) => b.avgScore - a.avgScore);

      setLeaderboard(users);
      setLoading(false);
    };

    loadLeaderboard();
  }, []);

  return (
    <>
      <Header user={user} />
      <main className="pt-20 p-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 cursor-pointer flex items-center text-green-600 font-medium hover:text-green-800 transition"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🏆 Leaderboard
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading leaderboard...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Avg Score</th>
                  <th className="p-4">Best Category</th>
                  <th className="p-4">Best Difficulty</th>
                  <th className="p-4">Quizzes</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`border-b ${
                      u.id === user.uid ? "bg-green-50 font-semibold" : ""
                    }`}
                  >
                    <td className="p-4">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </td>
                    <td className="p-4">
                    <div className="flex items-center gap-3">
                        <img
                        src={
                            u.photoURL ||
                            "https://ui-avatars.com/api/?name=Anonymous&background=22c55e&color=fff"
                        }
                        alt={u.name}
                        className="w-9 h-9 rounded-full border"
                        />
                        <span className="font-medium text-gray-800">{u.name}</span>
                    </div>
                    </td>
                    <td className="p-4">{u.avgScore}%</td>
                    <td className="p-4">{u.bestCategory}</td>
                    <td className="p-4">
                        {u.bestDifficulty && (
                            <span
                            className={`px-2 py-1 rounded-full text-white text-sm ${
                                u.bestDifficulty.toLowerCase() === "easy"
                                ? "bg-green-500"
                                : u.bestDifficulty.toLowerCase() === "medium"
                                ? "bg-yellow-500"
                                : u.bestDifficulty.toLowerCase() === "hard"
                                ? "bg-orange-500"
                                : u.bestDifficulty.toLowerCase() === "expert"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                            >
                            {u.bestDifficulty.charAt(0).toUpperCase() + u.bestDifficulty.slice(1)}
                            </span>
                        )}
                        </td>

                    <td className="p-4">{u.quizzes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default Leaderboard;
