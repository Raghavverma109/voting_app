// src/pages/Login.jsx
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react'

export default function Login() {
  const [aadhar, setAadhar] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const ok = await login({ aadhar, password })
    if (ok) nav('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Glowing Background Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/40">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">VoteSafe</h1>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to cast your vote securely</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Aadhar Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Aadhar Number
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === 'aadhar' ? 'transform scale-[1.02]' : ''
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User
                    className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'aadhar'
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  />
                </div>
                <input
                  type="text"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  onFocus={() => setFocusedField('aadhar')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your Aadhar number"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  maxLength={12}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === 'password' ? 'transform scale-[1.02]' : ''
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'password'
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/60 text-slate-400">
                  New to VoteSafe?
                </span>
              </div>
            </div>

            {/* Signup Link */}
            <Link
              to="/signup"
              className="block w-full text-center border-2 border-slate-600 hover:border-emerald-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:bg-slate-700/30"
            >
              Create Account
            </Link>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
