
import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, Home, LayoutDashboard, BookOpen, ShieldCheck, History, UserCircle } from 'lucide-react';
import FlashcardsPage from './pages/FlashcardsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LearningLadderPage from './pages/LearningLadderPage';
import DocumentVerificationPage from './pages/DocumentVerificationPage';
import HistoryMasteryPage from './pages/HistoryMasteryPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // No default user name
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    level: 'Beginner Explorer',
    streak: 0,
    xp: 0,
  });

  // Restore the signed-in user after refreshing the page
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('understandx_current_user');

      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.name && user.email) {
          setUserProfile((previous) => ({
            ...previous,
            name: user.name,
            email: user.email,
          }));

          setIsAuthenticated(true);
          setActiveTab('dashboard');
        }
      }
    } catch (error) {
      console.error('Unable to restore user session:', error);
      localStorage.removeItem('understandx_current_user');
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('understandx_current_user');

    setIsAuthenticated(false);
    setActiveTab('home');

    setUserProfile({
      name: '',
      email: '',
      level: 'Beginner Explorer',
      streak: 0,
      xp: 0,
    });
  };

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning', label: 'Learning Space', icon: BookOpen },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'history', label: 'My Progress', icon: History },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
  ];

  const renderPage = () => {
    if (activeTab === 'login') {
      return (
        <LoginPage
          setIsAuthenticated={setIsAuthenticated}
          setActiveTab={setActiveTab}
          setUserProfile={setUserProfile}
        />
      );
    }

    if (activeTab === 'home') {
      return <HomePage setActiveTab={setActiveTab} />;
    }

    // Require login before opening private pages
    if (!isAuthenticated) {
      return (
        <div className="mx-auto mt-20 max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <UserCircle className="mx-auto mb-4 text-violet-600" size={48} />
          <h2 className="text-2xl font-bold text-gray-800">
            Login Required
          </h2>
          <p className="mt-2 text-gray-600">
            Please log in to access your personal learning space.
          </p>
          <button
            onClick={() => setActiveTab('login')}
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Login to Continue
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            userProfile={userProfile}
            setActiveTab={setActiveTab}
          />
        );

      case 'learning':
        return (
          <LearningLadderPage
            userProfile={userProfile}
            setActiveTab={setActiveTab}
          />
        );

      case 'verification':
        return (
          <DocumentVerificationPage
            userProfile={userProfile}
            setActiveTab={setActiveTab}
          />
        );

      case 'history':
        return (
          <HistoryMasteryPage
            userProfile={userProfile}
            setActiveTab={setActiveTab}
          />
        );
        case 'flashcards':
  return (
    <FlashcardsPage
      userProfile={userProfile}
      setActiveTab={setActiveTab}
    />
  );

      default:
        return <DashboardPage userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#1E1B2E]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-gradient-to-br from-violet-600 to-teal-400 p-2 text-white shadow-md">
              <Sparkles size={25} />
            </div>

            <div className="text-left">
              <h1 className="text-xl font-extrabold tracking-tight">
                UNDERSTAND<span className="text-violet-600">X</span>
              </h1>
              <p className="text-xs text-gray-500">
                Learn. Understand. Verify.
              </p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-1">
            {navigation
              .filter((item) => {
                if (item.id === 'home') return true;
                return isAuthenticated;
              })
              .map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      activeTab === item.id
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
          </nav>

          {/* User area */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-gray-500">Welcome back,</p>
                  <p className="max-w-36 truncate font-bold text-violet-700">
                    {userProfile.name}
                  </p>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Sign out of your account"
                  className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="rounded-xl bg-violet-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:bg-violet-700"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Personalized welcome */}
      {isAuthenticated && activeTab !== 'login' && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <div className="rounded-full bg-violet-100 p-3 text-violet-700">
              <UserCircle size={27} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Welcome, {userProfile.name}! 👋
              </h2>
              <p className="text-sm text-gray-500">
                Ready to learn something new today?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-violet-100 bg-white px-4 py-6 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} UNDERSTANDX
          <span className="mx-2">·</span>
          Learn smarter, understand deeper.
        </p>
      </footer>
    </div>
  );
}