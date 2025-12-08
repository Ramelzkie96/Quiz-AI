import React from "react";
import { Logo } from "../assets/images/index.js";
import { logoutUser } from "../firebase/firebase";
import { FiLogOut } from "react-icons/fi";

const Header = ({ user }) => {
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <header className="bg-green-600 shadow-lg py-4 px-6 flex items-center justify-between">
      {/* Logo / Title */}
      <div className="flex items-center space-x-3">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
        <span className="text-2xl font-bold text-white">QuizAI</span>
      </div>

      {/* Navigation + User + Logout */}
      <div className="flex items-center space-x-6">
        {/* NAV LINKS */}
        <nav className="flex items-center space-x-6 text-white font-medium">
          <button className="hover:text-green-300 transition-colors cursor-pointer">
            Leaderboard
          </button>
          <button className="hover:text-green-300 transition-colors cursor-pointer">
            History
          </button>
        </nav>

        {/* USER PROFILE */}
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || "Profile"}
            className="w-7 h-7 rounded-full border-2 border-green-300"
          />
        )}

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="text-white hover:text-red-300 transition-colors cursor-pointer"
          title="Logout"
        >
          <FiLogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
