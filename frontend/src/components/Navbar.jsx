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
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-slate-900/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
              onClick={closeMobileMenu}
            >
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                VoteSafe
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/results" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
              >
                <BarChart size={18} />
                <span className="font-medium">Results</span>
              </Link>
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <Home size={18} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <User size={18} />
                  <span className="font-medium">Profile</span>
                </Link>

                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/30"
                  >
                    Admin Panel
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-emerald-500/30"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <BarChart size={20} />
              <span className="font-medium">Results</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <Home size={20} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link 
                  to="/profile" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <User size={20} />
                  <span className="font-medium">Profile</span>
                </Link>

                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium transition-all duration-200"
                  >
                    <ShieldCheck size={20} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-all duration-200 w-full text-left"
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
                  className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-center transition-all duration-200"
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