// src/pages/Dashboard.jsx
import React from 'react'
import CandidateList from '../components/CandidateList'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Cast your vote</h2>
        <CandidateList />
      </div>

      <aside className="space-y-4">
        <div className="glass p-4">
          <div className="text-sm text-slate-500">Your profile</div>
          <div className="mt-2 font-medium">{user?.aadhar ?? user?.name}</div>
          <div className="text-sm text-slate-500">{user?.role ?? 'Voter'}</div>
          <div className="mt-3">
            <Link to="/profile" className="text-sm underline">Manage profile</Link>
          </div>
        </div>

        <div className="glass p-4">
          <div className="text-sm">Quick actions</div>
          <div className="mt-2 flex flex-col gap-2">
            <Link to="/results" className="px-3 py-2 rounded-md border text-center">View results</Link>
            <Link to="/profile" className="px-3 py-2 rounded-md border text-center">Change password</Link>
          </div>
        </div>
      </aside>
    </div>
  )
}
