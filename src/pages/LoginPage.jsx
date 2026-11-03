
import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage({
  setIsAuthenticated,
  setActiveTab,
  setUserProfile,
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password || (isRegister && !cleanName)) {
      setError(
        isRegister
          ? 'Please enter your name, email, and password.'
          : 'Please enter your email and password.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Your password must contain at least 6 characters.');
      return;
    }

    let accounts = [];

    try {
      accounts = JSON.parse(
        localStorage.getItem('understandx_accounts') || '[]'
      );

      if (!Array.isArray(accounts)) {
        accounts = [];
      }
    } catch {
      setError('Unable to read saved accounts. Please refresh and try again.');
      return;
    }

    let account;

    if (isRegister) {
      const existingAccount = accounts.find(
        (item) => item.email === cleanEmail
      );

      if (existingAccount) {
        setError('An account with this email already exists. Please log in.');
        return;
      }

      account = {
        name: cleanName,
        email: cleanEmail,
        password,
      };

      try {
        localStorage.setItem(
          'understandx_accounts',
          JSON.stringify([...accounts, account])
        );
      } catch {
        setError('Unable to save your account in this browser.');
        return;
      }

      setMessage('Account created successfully!');
    } else {
      account = accounts.find(
        (item) =>
          item.email === cleanEmail && item.password === password
      );

      if (!account) {
        setError(
          'Account not found or password incorrect. Please check your details or register first.'
        );
        return;
      }
    }

    // Save the actual user's details in the app state
    const loggedInUser = {
      name: account.name,
      email: account.email,
    };

    setUserProfile((previous) => ({
      ...previous,
      name: loggedInUser.name,
      email: loggedInUser.email,
    }));

    // Persist the current session so refresh does not restore a default name
    try {
      localStorage.setItem(
        'understandx_current_user',
        JSON.stringify(loggedInUser)
      );
    } catch {
      setError('Unable to save your login session. Please try again.');
      return;
    }

    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        {/* Left panel */}
        <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-teal-500 p-8 text-white sm:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex rounded-2xl bg-white/15 p-4 shadow-lg backdrop-blur">
              <Sparkles size={38} />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Understand
              <br />
              More. Learn
              <br />
              Smarter.
            </h1>

            <p className="mt-6 max-w-sm leading-7 text-white/85">
              Your personal learning space to explore questions, understand
              answers step by step, and verify information with confidence.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <p className="flex items-center gap-3">
                <span className="rounded-full bg-white/20 p-1">✓</span>
                Personalized learning experience
              </p>
              <p className="flex items-center gap-3">
                <span className="rounded-full bg-white/20 p-1">✓</span>
                Step-by-step answer explanations
              </p>
              <p className="flex items-center gap-3">
                <span className="rounded-full bg-white/20 p-1">✓</span>
                Learn at your own pace
              </p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              UNDERSTANDX
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
              {isRegister ? 'Create your account' : 'Welcome back!'}
            </h2>

            <p className="mt-2 text-gray-500">
              {isRegister
                ? 'Join us and start your learning journey.'
                : 'Log in to continue your learning journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                  <User size={19} className="text-gray-400" />
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-transparent py-3.5 outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <Mail size={19} className="text-gray-400" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <Lock size={19} className="text-gray-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={
                    isRegister ? 'new-password' : 'current-password'
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent py-3.5 outline-none"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="text-gray-400 transition hover:text-violet-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {isRegister ? 'Create Account' : 'Login to UNDERSTANDX'}
              <ArrowRight size={19} />
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-gray-600">
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account yet?"}

            <button
              type="button"
              onClick={() => {
                setIsRegister((previous) => !previous);
                setError('');
                setMessage('');
                setPassword('');
              }}
              className="ml-2 font-bold text-violet-600 hover:text-violet-800"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="mt-6 w-full text-center text-sm text-gray-500 transition hover:text-violet-600"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}