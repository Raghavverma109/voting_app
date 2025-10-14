// src/components/CandidateList.jsx
import React, { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import CandidateCard from './CandidateCard'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'


export default function CandidateList() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, setUser } = useAuth()

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const res = await api.get('/candidates')
      
      setCandidates(res.data?.candidates || res.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Could not load candidates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
    // eslint-disable-next-line
  }, [])

  const handleVote = async (candidateId) => {
    if (!user) return toast.error('Please login to vote')
    try {

      // console.log("Voting for candidate:", candidateId);
      const res = await api.post(`/candidates/vote/${candidateId} `)
      console.log("Vote response:", res.data);
      
      toast.success('Vote cast ✅')
      // mark user as voted locally
      setUser((u) => ({ ...(u || {}), hasVoted: true }))
      localStorage.setItem('user', JSON.stringify({ ...(user || {}), hasVoted: true }))
      // refresh candidates and results counts
      fetchCandidates()
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Vote failed')
    }
  }

  if (loading) return <div>Loading candidates...</div>

  return (
    <div className="grid gap-4">
      {candidates.length === 0 ? (
        <div className="p-6 text-center">No candidates found.</div>
      ) : (
        candidates.map((c) => (
          <CandidateCard
            key={c._id}
            candidate={c}
            onVote={handleVote}
            disabled={user?.role === 'admin' || user?.hasVoted}
          />
        
        ))
      )}
    </div>
  )
}
