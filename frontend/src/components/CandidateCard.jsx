// src/components/CandidateCard.jsx
import React from 'react'
import { Check, User } from 'lucide-react'

export default function CandidateCard({ candidate, onVote, disabled }) {
  return (
    <div className="glass p-4 flex flex-col md:flex-row items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden">
        {candidate.image ? (
          <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
        ) : (
          <User className="text-black" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold">{candidate.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{candidate.party || 'Independent'}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            disabled ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
          onClick={() => !disabled && onVote(candidate._id)}
          disabled={disabled}
        >
          {disabled ? (
            <>
              <Check className="inline mr-1" /> Voted
            </>
          ) : (
            'Vote'
          )}
        </button>

        {/* <div className="text-sm text-slate-500">{candidate.votes ?? 0} votes</div> */}
      </div>
    </div>
  )
}
