import React, { useState, useEffect } from "react";
import Header from "./Header";
import NewUser from "./NewUser";
import CategorySelect from "./CategorySelect";
import DifficultySelect from "./DifficultySelect";
import QuizCard from "./QuizCard";
import CountdownScreen from "./CountdownScreen";

const Dashboard = ({ user }) => {
  const firstName = user.displayName.split(" ")[0].replace(/,$/, "").trim();

  const stats = {
    completedQuizzes: 0,
    accuracy: null,
    averageScore: null,
  };

  const [startQuiz, setStartQuiz] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [quizStarted, setQuizStarted] = useState(false);

  // New States 🔥
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [answers, setAnswers] = useState({});

  // STEP 1: Fetch Questions from Backend
  const fetchQuiz = async () => {
  setLoadingQuiz(true);
  const prompt = `
    Generate ${selectedDifficulty.count} multiple-choice questions about ${selectedCategory}.
    Difficulty: ${selectedDifficulty.level}.
    Format as JSON like:
    [
      {
        "question": "Sample?",
        "options": ["A","B","C","D"],
        "answer": "A"
      }
    ]
  `;

  try {
    const response = await fetch("http://localhost:5000/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: selectedCategory, difficulty: selectedDifficulty.level, count: selectedDifficulty.count }),
    });

    const data = await response.json(); // <-- backend already returns JSON array
    setQuestions(data); // no need to parse again
  } catch (error) {
    console.error("Fetch Error:", error);
    alert("Error loading questions from AI!");
  }
  setLoadingQuiz(false);
};


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

  return (
    <div>
      <Header user={user} />

      <main className="p-6 pt-20">
        <h1 className="text-4xl font-bold mb-6 text-center text-green-700 animate-bounce">
          Welcome to Quiz AI🤖, <span className="text-green-500">{firstName}!</span>
        </h1>

        {!startQuiz ? (
          <NewUser stats={stats} onStart={() => setStartQuiz(true)} />
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
          <p className="text-center text-xl font-semibold text-green-500 mt-10">
            ⏳ Loading Questions from AI...
          </p>
        ) : (
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
              // onSubmit={handleSubmitQuiz}
            />
        </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
