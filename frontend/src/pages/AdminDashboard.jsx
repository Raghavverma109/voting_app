// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import toast from 'react-hot-toast'


export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([])
  const [name, setName] = useState('')
  const [party, setParty] = useState('')
  const [editing, setEditing] = useState(null)
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null) // store the selected file


  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidates')
      setCandidates(res.data?.candidates || res.data || [])
    } catch (err) {
      toast.error('Could not load candidates')
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const addCandidate = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("party", party)
      if (file) formData.append("image", file) // send the actual file

      await api.post('/candidates', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setName('')
      setParty('')
      setFile(null)
      toast.success('Candidate added')
      fetchCandidates()
    } catch (err) {
      console.error(err)
      toast.error('Add failed')
    }
  }

  const startEdit = (c) => {
    setEditing(c)
    setName(c.name)
    setParty(c.party)
    setImage(c.image || null) // ✅ load existing image if any
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("party", party)
      if (file) formData.append("image", file)

      await api.put(`/candidates/${editing._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setEditing(null)
      setName('')
      setParty('')
      setFile(null)
      toast.success('Updated')
      fetchCandidates()
    } catch (err) {
      toast.error('Update failed')
    }
  }



  const remove = async (id) => {
    if (!confirm('Delete candidate?')) return
    try {
      await api.delete(`/candidates/${id}`)
      toast.success('Deleted')
      fetchCandidates()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="max-w-4xl mx-auto grid gap-6">
      <div className="glass p-4">
        <h3 className="font-semibold mb-3">Add / Edit Candidate</h3>
        <form onSubmit={editing ? saveEdit : addCandidate} className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <label className="relative cursor-pointer">
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFile(e.target.files[0]) // store file
                  }
                }}
              />
              <div
                className="w-12 h-12 rounded-full border flex items-center justify-center overflow-hidden bg-slate-100"
                onClick={() => document.getElementById('profile-upload').click()}
              >
                {file ? (
                  <img
                    src={URL.createObjectURL(file)} // preview the file
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400">+</span>
                )}
              </div>

            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Candi Name"
              className="px-3 py-2 rounded-md border"
            />
          </div>
          <input
            value={party}
            onChange={(e) => setParty(e.target.value)}
            placeholder="Party"
            className="px-3 py-2 rounded-md border"
          />
          <div className="md:col-span-2">
            <button className="px-4 py-2 rounded-md bg-emerald-600 text-white">
              {editing ? 'Save' : 'Add'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setName(''); setParty(''); setImage(null); }}
                className="ml-2 px-3 py-2 rounded-md border"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass p-4">
        <h3 className="font-semibold mb-3">Candidates</h3>
        <div className="space-y-3">
          {candidates.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full border overflow-hidden bg-slate-100 flex items-center justify-center"
                  onClick={() => startEdit(c)}
                  style={{ cursor: 'pointer' }}
                  title="Edit logo"
                >
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={`${c.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-400">+</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-slate-500">{c.party}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="px-3 py-1 rounded-md border">Edit</button>
                <button onClick={() => remove(c._id)} className="px-3 py-1 rounded-md bg-red-500 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
