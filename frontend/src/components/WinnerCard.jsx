// src/components/WinnerCard.jsx
import React from 'react'
import Confetti from 'react-confetti'
import { Crown } from 'lucide-react'
import useWindowSize from '../hooks/useWindowSize' // we'll add a tiny hook below

export default function WinnerCard({ winner, celebrate = false }) {
  const size = useWindowSize()

  if (!winner) {
    return (
      <div className="glass p-6 text-center">
        <div className="text-sm text-slate-500">No winner yet</div>
      </div>
    )
  }

  return (
    <div className="glass p-6 flex items-center gap-4">
      {celebrate && <Confetti width={size.width} height={size.height} numberOfPieces={250} />}

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            <Crown />
          </div>
          <div>
            <div className="text-sm text-slate-500">Current Leader</div>
            <div className="text-xl font-bold">{winner.name}</div>
            <div className="text-sm text-slate-600">{winner.party}</div>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs text-slate-500">Votes</div>
        <div className="text-2xl font-bold">{winner.votes ?? 0}</div>
      </div>
    </div>
  )
}
