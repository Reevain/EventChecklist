import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
              EventPilot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/events')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              Events
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/about')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/profile')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fadeIn">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                isActive('/events') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Events
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

