// src/components/ResultCard.jsx
import React, { useState } from 'react';
import ResultChart from './ResultChart';

const ResultCard = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const chartData = result.participants.map(p => ({
    name: p.name,
    party: p.party,
    voteCount: p.voteCount,
  }));

  return (
    <div 
      className="glass p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="border-b border-slate-700 pb-3 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{result.title}</h2>
          <p className="text-sm text-slate-400">
            {/* ✅ CORRECTED THIS LINE 👇 */}
            Held on: {new Date(result.dateOfElection).toLocaleDateString()}
          </p>
        </div>
        <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>

      {/* --- Winner Section (No changes here) --- */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-emerald-400 mb-2">
          {result.result === 'Tie' ? 'Result: Tie' : 'Winner'}
        </h3>
        {result.result === 'Tie' ? (
          <div className="flex flex-wrap gap-4">
            {result.winner.map((w, index) => (
              <div key={index} className="bg-slate-700 p-3 rounded">
                <p className="font-medium text-white">{w.name}</p>
                <p className="text-sm text-slate-300">{w.votes.toLocaleString()} votes</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-700 p-3 rounded">
            <p className="font-medium text-white text-xl">{result.winner.name}</p>
            <p className="text-sm text-slate-300">{result.winner.party}</p>
            <p className="text-lg text-emerald-400 font-bold mt-1">
              {result.winner.votes.toLocaleString()} votes
            </p>
          </div>
        )}
      </div>

      {/* --- Chart Section (No changes here) --- */}
      {isExpanded && (
        <div className="mt-6">
          <ResultChart data={chartData} />
        </div>
      )}
    </div>
  );
};

export default ResultCard;