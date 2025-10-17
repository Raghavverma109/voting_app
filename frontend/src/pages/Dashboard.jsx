// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getElections } from '../api/electionService';
import ElectionCard from '../components/ElectionCard';
import VotingPanel from '../components/VotingPanel';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElectionId, setSelectedElectionId] = useState(null);

  useEffect(() => {
    const fetchAllElections = async () => {
      try {
        const { data } = await getElections();
        setElections(data);
      } catch (error) {
        toast.error('Could not load elections.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllElections();
  }, []);

  const handleSelectElection = (electionId, status) => {
    if (status === 'Live') {
      setSelectedElectionId(electionId);
    } else if (status === 'Completed') {
      navigate('/results');
    } else {
      toast.error('This election has not started yet.');
    }
  };

  const today = new Date();
  const currentElections = elections.filter(e => new Date(e.dateOfElection).toDateString() === today.toDateString());
  const otherElections = elections.filter(e => new Date(e.dateOfElection).toDateString() !== today.toDateString());

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 p-4">
      <div className="md:col-span-2">
        {selectedElectionId ? (
          <VotingPanel 
            electionId={selectedElectionId} 
            onBack={() => setSelectedElectionId(null)} 
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Live Elections</h2>
              {loading ? (
                 <p className="text-slate-400">Loading...</p>
              ) : currentElections.length > 0 ? (
                currentElections.map(election => (
                  <ElectionCard key={election._id} election={election} onSelect={handleSelectElection} />
                ))
              ) : (
                <p className="text-slate-400">No live elections running today.</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Other Elections</h2>
              {loading ? (
                 <p className="text-slate-400">Loading...</p>
              ) : otherElections.length > 0 ? (
                otherElections.map(election => (
                  <ElectionCard key={election._id} election={election} onSelect={handleSelectElection} />
                ))
              ) : (
                <p className="text-slate-400">No other elections found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        {/* Your existing sidebar code remains unchanged */}
        <div className="glass p-4 rounded-lg">
          <div className="text-sm text-slate-500">Your profile</div>
          <div className="mt-2 font-medium text-white">{user?.name}</div>
          <div className="text-sm text-slate-500">{user?.role ?? 'Voter'}</div>
          <div className="mt-3">
            <Link to="/profile" className="text-sm text-sky-400 hover:underline">Manage profile</Link>
          </div>
        </div>
        <div className="glass p-4 rounded-lg">
          <div className="text-sm text-slate-400">Quick actions</div>
          <div className="mt-2 flex flex-col gap-2">
            <Link to="/results" className="px-3 py-2 rounded-md border border-slate-700 text-center text-white hover:bg-slate-700">View Results</Link>
            <Link to="/live-results" className="px-3 py-2 rounded-md border border-slate-700 text-center text-white hover:bg-slate-700">View Live Results</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}