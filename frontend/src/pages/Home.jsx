// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Vote, BarChart3, Lock, CheckCircle, Users } from 'lucide-react'

export default function Home() {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/voting-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hide scrollbar */}
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
      </style>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/90"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Content */}
      <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-12">
        {/* Logo/Badge */}
        <div className="mb-8 animate-fadeInUp">
          <div className="w-20 h-20 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center shadow-2xl">
            <Vote className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 backdrop-blur-xl p-8 sm:p-12 text-center max-w-4xl w-full rounded-3xl shadow-2xl animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          {/* Title Section */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full mb-4">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm font-medium">Blockchain Secured</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
              Secure <span className="text-slate-300">Aadhar-based</span> Voting
            </h1>
            
            <p className="text-slate-400 text-lg sm:text-xl mb-2 max-w-2xl mx-auto leading-relaxed">
              Your voice matters. Vote securely with Aadhar authentication and experience real-time transparency.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full">
              <Lock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm">Instant Verification</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm">Anonymous Voting</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/login" 
              className="group relative px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Login to Vote
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/signup" 
              className="px-8 py-4 rounded-xl border-2 border-slate-700 text-white font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
              Create Account
            </Link>
            
            <Link 
              to="/results" 
              className="group px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold hover:bg-slate-750 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Live Results
              </span>
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-400 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">256-bit</div>
            <div className="text-sm">Encryption</div>
          </div>
          <div className="w-px h-12 bg-slate-800"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm">Secure</div>
          </div>
          <div className="w-px h-12 bg-slate-800"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm">Available</div>
          </div>
        </div>
      </div>
    </div>
  )
}