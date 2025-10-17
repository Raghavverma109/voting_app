// src/components/VotingPanel.jsx
import React, { useState, useEffect } from 'react';
import { getElectionById, castVote } from '../api/electionService';
import toast from 'react-hot-toast';

const VotingPanel = ({ electionId, onBack }) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        const { data } = await getElectionById(electionId);
        setElection(data);
      } catch (error) {
        toast.error('Failed to load election details.');
      } finally {
        setLoading(false);
      }
    };
    fetchElectionDetails();
  }, [electionId]);

  const handleVote = async () => {
    if (!selectedCandidate) return toast.error('Please select a candidate to vote.');
    
    const toastId = toast.loading('Casting your vote...');
    try {
      await castVote(electionId, selectedCandidate);
      toast.success('Vote cast successfully! Thank you for participating.', { id: toastId });
      onBack(); // Go back to the dashboard after voting
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to cast vote.', { id: toastId });
    }
  };

  if (loading) return <p className="text-center text-slate-400 p-8">Loading Candidates...</p>;
  if (!election) return null;

  return (
    <div className="glass p-6 rounded-lg">
      <button onClick={onBack} className="text-sky-400 hover:underline mb-4">
        &larr; Back to Elections
      </button>
      <h2 className="text-2xl font-bold text-white mb-1">{election.title}</h2>
      <p className="text-slate-400 mb-6">Select a candidate and cast your vote.</p>

      <div className="space-y-3">
        {election.parties.map(({ candidate }) => (
          <div
            key={candidate._id}
            onClick={() => setSelectedCandidate(candidate._id)}
            className={`flex items-center gap-4 p-3 border-2 rounded-md cursor-pointer transition-all ${
              selectedCandidate === candidate._id ? 'border-sky-500 bg-sky-900/50' : 'border-slate-700 hover:border-sky-600'
            }`}
          >
            <img src={candidate.image} alt={candidate.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-medium text-white">{candidate.name}</p>
              <p className="text-sm text-slate-400">{candidate.party}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleVote} 
        disabled={!selectedCandidate}
        className="w-full mt-6 px-4 py-3 rounded-md bg-emerald-600 text-white font-bold disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-emerald-700"
      >
        Confirm and Cast Vote
      </button>
    </div>
  );
};

export default VotingPanel;