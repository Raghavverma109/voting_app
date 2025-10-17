// src/components/ElectionCard.jsx
import React from 'react';

const ElectionCard = ({ election, onSelect }) => {
  const today = new Date();
  const electionDate = new Date(election.dateOfElection);
  let status, statusColor, actionText;

  // Determine the status of the election
  if (electionDate.toDateString() === today.toDateString()) {
    status = 'Live';
    statusColor = 'bg-red-700';
    actionText = 'Vote Now';
  } else if (electionDate > today) {
    status = 'Upcoming';
    statusColor = 'bg-sky-500';
    actionText = 'View Candidates';
  } else {
    status = 'Completed';
    statusColor = 'bg-slate-500';
    actionText = 'View Results';
  }

  return (
    <div className="glass p-4 rounded-lg flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
         <span className={`px-3 py-1 text-xs font-bold text-white rounded ${statusColor} ${status === 'Live' ? 'animate-pulse' : ''}`}>
            {status}
          </span>
          <h3 className="font-bold text-white text-lg">{election.title}</h3>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Date: {electionDate.toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => onSelect(election._id, status)}
        className="px-4 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors"
      >
        {actionText}
      </button>
    </div>
  );
};

export default ElectionCard;