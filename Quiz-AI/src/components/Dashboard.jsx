import React, { useState, useEffect } from "react";
import Header from "./Header";
import NewUser from "./NewUser";
import CategorySelect from "./CategorySelect";
import DifficultySelect from "./DifficultySelect";
import QuizCard from "./QuizCard";
import CountdownScreen from "./CountdownScreen";
import QuizResult from "./QuizResult";
import {getFirestore, doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import QuizAnswers from "./QuizAnswers";
import ReturningUser from "./ReturningUser";
import LoadingQuiz from "./LoadingQuiz";

const db = getFirestore();
const auth = getAuth();
// Add this under your imports
const styles = `
@keyframes loadingDots {
  0% { content: "."; }
  25% { content: ".."; }
  50% { content: "..."; }
  75% { content: "...."; }
  100% { content: "."; }
}
.loading-dots::after {
  content: "...";
  animation: loadingDots 1.2s infinite steps(4);
}
`;
const Dashboard = ({ user }) => {
  const firstName = user.displayName.split(" ")[0].replace(/,$/, "").trim();

  const [stats, setStats] = useState(null);
const [lastQuiz, setLastQuiz] = useState(null);

  const [startQuiz, setStartQuiz] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
const [quizFinished, setQuizFinished] = useState(false);
const [score, setScore] = useState(0);
const [viewingAnswers, setViewingAnswers] = useState(false);
const [statsLoading, setStatsLoading] = useState(true);
const [scores, setScores] = useState([]);



useEffect(() => {
  const loadUserStats = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setStatsLoading(false);
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      setStats({ completedQuizzes: 0 });
      setStatsLoading(false);
      return;
    }

    const scores = snap.data().scores || [];
    setScores(scores);

    if (scores.length === 0) {
      setStats({ completedQuizzes: 0 });
      setStatsLoading(false);
      return;
    }

    const last = scores[scores.length - 1];

    // Completed quizzes
    const completedQuizzes = scores.length;

    // Average score across all quizzes
    const averageScore = Math.round(
      (scores.reduce((sum, s) => sum + s.score / s.totalQuestions, 0) /
        completedQuizzes) *
        100
    );

    // ----- BEST CATEGORY CALCULATION -----
    const categoryMap = {};

    scores.forEach((s) => {
      if (!categoryMap[s.category]) {
        categoryMap[s.category] = { totalScore: 0, totalQuestions: 0 };
      }
      categoryMap[s.category].totalScore += s.score;
      categoryMap[s.category].totalQuestions += s.totalQuestions;
    });

    // Compute percentage per category
    let bestCategory = "";
    let bestPercentage = -1;

    for (const category in categoryMap) {
      const { totalScore, totalQuestions } = categoryMap[category];
      const categoryPercent = (totalScore / totalQuestions) * 100;

      if (categoryPercent > bestPercentage) {
        bestPercentage = categoryPercent;
        bestCategory = category;
      }
    }

    // Save stats
    setStats({
      completedQuizzes,
      averageScore,
      bestCategory,
    });

    setLastQuiz(last);
    setStatsLoading(false);
  };

  loadUserStats();
}, []);




  // STEP 1: Fetch Questions from Backend
const fetchQuiz = async () => {
  setLoadingQuiz(true);
  setErrorMessage("");

  try {
    const response = await fetch("http://localhost:5000/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: selectedCategory,
        difficulty: selectedDifficulty.level,
        count: selectedDifficulty.count
      }),
    });

    const data = await response.json();

    if (!response.ok) {

      // ⭐ NEW: Handle 429 daily quota limit from backend
      if (response.status === 429) {
        const reset = data.resetIn || "unknown time";
        const retry = data.retryAfterSeconds || 60;

        setErrorMessage(
          `🚫 Gemini Free Tier Limit Reached\n\n` +
          `You used all 20 free requests for today.\n` +
          `⏳ Resets in: ${reset}\n` +
          `🔁 Retry possible after: ${retry} seconds`
        );

        setLoadingQuiz(false);
        return;
      }

      throw new Error(data.error || "Unknown error occurred");
    }

    setQuestions(data);

  } catch (error) {
    console.error("Fetch Error:", error);
    setErrorMessage(error.message);
  }

  setLoadingQuiz(false);
};


useEffect(() => {
  const s = document.createElement("style");
  s.innerHTML = styles;
  document.head.appendChild(s);
  return () => document.head.removeChild(s);
}, []);
  // STEP 2: Countdown & Fetch before Start
  useEffect(() => {
    if (selectedCategory && selectedDifficulty && countdown === 3) {
      fetchQuiz(); // fetch when countdown starts
    }

    if (selectedCategory && selectedDifficulty && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setQuizStarted(true);
    }
  }, [countdown, selectedCategory, selectedDifficulty]);

  // Navigation Events
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

 
const handleAnswerSelect = (answer) => {
  setAnswers((prev) => ({
    ...prev,
    [currentIndex]: answer, // store by index
  }));
};

// Shows children only after X milliseconds
const DelayedMessage = ({ time, children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), time);
    return () => clearTimeout(timer);
  }, [time]);

  return show ? children : null;
};

const handleSubmitQuiz = async () => {
  // Compute the score
  let computedScore = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.answer) {
      computedScore++;
    }
  });

  setScore(computedScore);
  setQuizFinished(true);

  try {
    const user = auth.currentUser;
    if (!user) return; // if user not logged in, skip saving

    const userRef = doc(db, "users", user.uid);

    // Save the quiz attempt in a "scores" array
    await setDoc(
      userRef,
      {
        scores: arrayUnion({
          score: computedScore,
          totalQuestions: questions.length,
          category: selectedCategory,
          difficulty: selectedDifficulty.level,
          timestamp: new Date()
        })
      },
      { merge: true } // merge so it doesn't overwrite existing data
    );
  } catch (err) {
    alert("❌ Error saving score:", err);
  }
};


const handleRestart = () => {
  console("testing")
};

const handleViewAnswers = () => {
  setViewingAnswers(true);
};

if (viewingAnswers) {
  return (
    <div>
      <Header user={user} scores={scores} />

      <main className="p-6 pt-20">
        <QuizAnswers
          questions={questions}
          answers={answers}
          onBack={() => setViewingAnswers(false)}
        />
      </main>
    </div>
  );
}

if (statsLoading) {
  return (
    <div>
        <LoadingQuiz />
    </div>
  );
}

  return (
  <div>
    <Header user={user} scores={scores} />


    <main className="p-6 pt-10">
      {/* Welcome message ONLY for true new users */}
    {stats.completedQuizzes === 0 && (
      <h1 className="text-4xl font-bold mb-6 text-center text-green-700 animate-bounce">
        Welcome to Quiz AI 🤖,{" "}
        <span className="text-green-500">{firstName}!</span>
      </h1>
    )}
      {!startQuiz ? (
        stats && stats.completedQuizzes > 0 ? (
          <ReturningUser
            stats={stats}
            lastQuiz={lastQuiz}
            onStart={() => setStartQuiz(true)}
          />
        ) : (
          <NewUser onStart={() => setStartQuiz(true)} />
        )
      ) : !selectedCategory ? (
        <CategorySelect onSelect={(cat) => setSelectedCategory(cat)} />
      ) : !selectedDifficulty ? (
        <DifficultySelect
          category={selectedCategory}
          onSelect={(diffObj) => setSelectedDifficulty(diffObj)}
        />
      ) : !quizStarted ? (
        <CountdownScreen
          category={selectedCategory}
          difficulty={selectedDifficulty.level}
          count={selectedDifficulty.count}
          countdown={countdown}
        />
      ) : loadingQuiz ? (
  <div className="text-center mt-10">
    <p className="text-xl font-semibold text-green-600 flex justify-center items-center gap-2">
      <span className="animate-spin inline-block text-3xl">⏳</span>
      <span className="loading-dots text-xl">Loading Questions from AI</span>
    </p>

    {/* After 10 seconds show extra message */}
    <DelayedMessage time={10000}>
      <p className="text-sm text-gray-500 mt-4 italic">
        🤖 The AI is generating your quiz… please wait.
      </p>
    </DelayedMessage>
  </div>

      ) : quizFinished ? (
        <QuizResult
          score={score}
          totalQuestions={questions.length}
          onViewAnswers={handleViewAnswers}
          onRestart={handleRestart}
        />
      ) : (
        <>
          {errorMessage && (
            <div className="max-w-xl mx-auto mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-semibold shadow">
              ⚠ {errorMessage}
            </div>
          )}

          <div className="mt-10">
            <QuizCard
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              question={questions[currentIndex]?.question}
              options={questions[currentIndex]?.options}
              selectedAnswer={answers[currentIndex] ?? null}
              category={selectedCategory}
              difficulty={selectedDifficulty.level}
              onSelect={handleAnswerSelect}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={handleSubmitQuiz} // ✅ Submits quiz and shows result
            />
          </div>
        </>
      )}
    </main>
  </div>
);

};

export default Dashboard;
