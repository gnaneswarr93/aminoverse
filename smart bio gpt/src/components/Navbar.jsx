import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar({ onLogout }) {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white shadow-md">
      <h1 className="text-2xl font-bold text-neon">Smart Bio GPT</h1>
      <div className="flex items-center space-x-4">
        <FaUserCircle size={30} className="hover:text-neon transition" />
        <button
          onClick={onLogout}
          className="text-sm text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}