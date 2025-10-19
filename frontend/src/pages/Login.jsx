// src/pages/Login.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, User, Vote, ArrowRight } from 'lucide-react'
import axios from 'axios' // ✅ Import axios

export default function Login() {
  const [aadhar, setAadhar] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  // ✅ Backend connection check
  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => console.log("✅ Backend connected:", res.data))
      .catch(err => console.error("❌ Backend not reachable:", err))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const ok = await login({ addharCardNumber: aadhar, password })
    if (ok) nav('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-slate-800 border-2 border-slate-700 p-3 rounded-2xl">
                <Vote className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                <p className="text-slate-400 text-sm">Sign in to Your Account</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Aadhar Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Aadhar Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User
                    className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'aadhar'
                        ? 'text-slate-300'
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-all duration-200"
                  maxLength={12}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'password'
                        ? 'text-slate-300'
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-all duration-200"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-400">
                  New to VoteSafe?
                </span>
              </div>
            </div>

            {/* Signup Link */}
            <Link
              to="/signup"
              className="block w-full text-center border-2 border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-200"
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
