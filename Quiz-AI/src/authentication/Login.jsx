import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { Google } from "../assets/images/index";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user profile to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          lastLogin: serverTimestamp(),
        },
        { merge: true } // merge to keep scores array
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Test Your Knowledge with QuizAI
        </h1>

        <p className="text-gray-500 mb-8">
          Sign in with your Google account to continue
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-green-200 hover:bg-green-300 text-green-800 font-semibold py-3 pr-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <img src={Google} alt="google logo" className="w-5 h-5" />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <p className="text-gray-400 mt-6 text-sm">
          By signing in, you agree to our{" "}
          <span className="text-blue-500 underline cursor-pointer">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-blue-500 underline cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
