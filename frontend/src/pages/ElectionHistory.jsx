// src/pages/ElectionHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getElections } from '../api/electionService'; // We can reuse this
import toast from 'react-hot-toast';

const ElectionHistory = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllElections = async () => {
      try {
        const { data } = await getElections();
        // Filter for past elections if your getElections returns all
        // const pastElections = data.filter(e => new Date(e.dateOfElection) < new Date());
        setElections(data);
      } catch (error) {
        toast.error('Failed to fetch election history.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllElections();
  }, []);

  if (loading) return <p className="text-center text-slate-400 p-8">Loading History...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Election Audit History</h1>
      <div className="glass p-4 rounded-lg space-y-3">
        {elections.map(election => (
          <div key={election._id} className="flex justify-between items-center p-3 bg-slate-800/50 border border-slate-700 rounded-md">
            <div>
              <p className="font-medium text-white">{election.title}</p>
              <p className="text-sm text-slate-400">
                {new Date(election.dateOfElection).toLocaleDateString()}
              </p>
            </div>
            <Link
              to={`/admin/history/${election._id}`}
              className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
            >
              View Audit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionHistory;