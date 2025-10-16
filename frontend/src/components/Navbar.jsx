// src/components/Navbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Home, BarChart, Menu, X, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const nav = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    nav('/login')
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 group"
              onClick={closeMobileMenu}
            >
              <div className="transition-transform duration-300 group-hover:scale-105">
                <img src="/logo.png" alt="VoteSafe Logo" className="h-10 w-10" />
              </div>
              <span className="text-2xl font-bold text-white">
                VoteSafe
              </span>
            </Link>


            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/live-results" // ✅ Changed this from "/results"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
              >
                <BarChart size={18} color='red' />
                <span className="font-medium">Live Results</span>
              </Link>
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <Home size={18} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <User size={18} />
                  <span className="font-medium">Profile</span>
                </Link>

                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium hover:bg-slate-750 transition-all duration-200"
                  >
                    <ShieldCheck size={18} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 ml-2"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4 space-y-2">
            <Link
              to="/results"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <BarChart size={20} />
              <span className="font-medium">Results</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <Home size={20} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <User size={20} />
                  <span className="font-medium">Profile</span>
                </Link>

                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium transition-all duration-200"
                  >
                    <ShieldCheck size={20} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 w-full text-left"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-lg bg-white text-slate-900 font-semibold text-center transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}