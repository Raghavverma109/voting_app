// src/App.jsx
import React from 'react'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <AppRoutes />
      </main>
    </div>
  )
}
