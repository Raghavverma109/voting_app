// // src/pages/Results.jsx
// import React, { useEffect, useMemo, useState } from 'react'
// import api from '../api/axiosConfig'
// import ResultChart from '../components/ResultChart'
// import WinnerCard from '../components/WinnerCard'
// import toast from 'react-hot-toast'

// export default function Results() {
//   const [counts, setCounts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [celebrate, setCelebrate] = useState(false)

//   const fetchCounts = async () => {
//     try {
//       setLoading(true)
//       const res = await api.get('/candidates/vote/count')

//       // format: convert to [{name, votes, _id/ candidateId}] as needed
//       const raw = res.data?.count || res.data || []
//       // adapt many backends return list of {candidateId, name, votes}
//       const arr = raw.map((r) => ({
//         _id: r._id,
//         name: r.name,
//         votes: r.count,
//         party: r.party,
//       }))
//       setCounts(arr)
//     } catch (err) {
//       console.error(err)
//       toast.error('Could not fetch counts')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchCounts()
//     const interval = setInterval(fetchCounts, 6000)
//     return () => clearInterval(interval)
//   }, [])

//   const sorted = useMemo(() => [...counts].sort((a, b) => (b.votes || 0) - (a.votes || 0)), [counts])
//   const winner = sorted.length ? sorted[0] : null
  


//   return (
//     <div className="max-w-5xl mx-auto space-y-6">
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Live Results</h2>
//         <p className="text-sm text-slate-500">Results update live. This page polls the backend periodically.</p>
//       </div>

//       <WinnerCard winner={winner} celebrate={celebrate} />

//       <div className="flex justify-end">
//         <button onClick={() => setCelebrate((c) => !c)} className="px-3 py-1 rounded-md border">
//           {celebrate ? 'Stop Confetti' : 'Celebrate Winner'}
//         </button>
//       </div>

//       {loading ? <div>Loading charts...</div> : <ResultChart data={sorted.map((s) => ({ name: s.name, votes: s.votes, party: s.party }))} />}
        
//     </div>
//   )
// }




// src/pages/Results.jsx
import React, { useState, useEffect } from 'react';
import { getElectionResults } from '../api/electionService';
import ResultCard from '../components/ResultCard'; // We will create this next
import toast from 'react-hot-toast';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await getElectionResults();
        setResults(data);
      } catch (error) {
        toast.error('Failed to fetch election results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white text-center">Election Results</h1>

      {loading ? (
        <p className="text-center text-slate-400">Loading results...</p>
      ) : results.length === 0 ? (
        <div className="glass text-center p-8 rounded-lg">
            <p className="text-slate-400">No completed elections found yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard key={result.electionId} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;