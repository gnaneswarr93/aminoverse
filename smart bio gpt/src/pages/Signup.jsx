import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password);
      nav('/');
    } catch (err) {
      const code = err.code;
      if (code === 'auth/email-already-in-use')
        setError('Email already in use.');
      else if (code === 'auth/weak-password')
        setError('Password too weak.');
      else setError('Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <img
          src="https://undraw.co/api/illustrations/7cca6353-8626-45f6-8db5-e50fdba36810"
          alt="Sign Up"
          className="w-3/4 animate-glow"
        />
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-xl space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-neon text-center animate-glow">
            Create an Account
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
              placeholder="you@example.com"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-300">Password</label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-9 text-gray-400"
            >
              {showPwd ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-neon text-black font-semibold rounded-lg hover:bg-indigo-500 transition"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-neon hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}