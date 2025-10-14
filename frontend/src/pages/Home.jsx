// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/voting-bg.jpg')", // 👈 place in /public
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hide scrollbar but keep scrolling */}
      <style>
        {`
          /* Works on most browsers */
          ::-webkit-scrollbar {
            display: none;
          }
          body {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
          }
        `}
      </style>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 text-center max-w-3xl w-full rounded-xl shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
            Secure Aadhar-based Voting
          </h1>
          <p className="text-slate-200 mb-4 text-sm sm:text-base">
            A simple, robust voting frontend that connects to your Node/Express backend. 
            Vote securely using your Aadhar and view live results.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/login" className="px-4 sm:px-5 py-2 rounded-md bg-emerald-600 text-white shadow">
              Login
            </Link>
            <Link to="/signup" className="px-4 sm:px-5 py-2 rounded-md border text-white border-white">
              Get an account
            </Link>
            <Link to="/results" className="px-4 sm:px-5 py-2 rounded-md border text-white border-white">
              View results
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
