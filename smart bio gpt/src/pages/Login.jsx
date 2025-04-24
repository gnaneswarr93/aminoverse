import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      const code = err.code;
      if (code === 'auth/user-not-found') setError('No account found.');
      else if (code === 'auth/wrong-password') setError('Wrong password.');
      else setError('Failed to log in.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <img
          src="https://undraw.co/api/illustrations/ef5c3bd7-c6ec-4b68-9472-5bd5e1d2f0e7"
          alt="Login"
          className="w-3/4 animate-pulse"
        />
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-xl space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-neon text-center animate-pulse">
            Aminoverse Login
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
            Log In
          </button>
          <p className="text-center text-gray-400">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-neon hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}