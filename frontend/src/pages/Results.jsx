// src/pages/Results.jsx
import React, { useEffect, useMemo, useState } from 'react'
import api from '../api/axiosConfig'
import ResultChart from '../components/ResultChart'
import WinnerCard from '../components/WinnerCard'
import toast from 'react-hot-toast'

export default function Results() {
  const [counts, setCounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  const fetchCounts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/candidates/vote/count')

      // format: convert to [{name, votes, _id/ candidateId}] as needed
      const raw = res.data?.count || res.data || []
      // adapt many backends return list of {candidateId, name, votes}
      const arr = raw.map((r) => ({
        _id: r._id,
        name: r.name,
        votes: r.count,
        party: r.party,
      }))
      setCounts(arr)
    } catch (err) {
      console.error(err)
      toast.error('Could not fetch counts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounts()
    const interval = setInterval(fetchCounts, 6000)
    return () => clearInterval(interval)
  }, [])

  const sorted = useMemo(() => [...counts].sort((a, b) => (b.votes || 0) - (a.votes || 0)), [counts])
  const winner = sorted.length ? sorted[0] : null
 


  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Live Results</h2>
        <p className="text-sm text-slate-500">Results update live. This page polls the backend periodically.</p>
      </div>

      <WinnerCard winner={winner} celebrate={celebrate} />

      <div className="flex justify-end">
        <button onClick={() => setCelebrate((c) => !c)} className="px-3 py-1 rounded-md border">
          {celebrate ? 'Stop Confetti' : 'Celebrate Winner'}
        </button>
      </div>

      {loading ? <div>Loading charts...</div> : <ResultChart data={sorted.map((s) => ({ name: s.name, votes: s.votes, party: s.party }))} />}
        
    </div>
  )
}
