// src/pages/ManageParties.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

// Reusable component for the image uploader/preview
const ImageUploader = ({ file, existingImage, onFileChange }) => (
  <label className="relative cursor-pointer">
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => onFileChange(e.target.files[0] || null)}
    />
    <div className="w-16 h-16 rounded-full border-2 border-slate-600 flex items-center justify-center overflow-hidden bg-slate-800 hover:bg-slate-700 transition-colors">
      {file ? (
        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
      ) : existingImage ? (
        <img src={existingImage} alt="existing" className="w-full h-full object-cover" />
      ) : (
        <span className="text-3xl text-slate-500">+</span>
      )}
    </div>
  </label>
);

export default function ManageParties() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the form
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [file, setFile] = useState(null); // The new image file to upload
  
  // State to track which candidate is being edited
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Use useCallback to memoize the fetch function
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/candidates');
      setCandidates(res.data || []);
    } catch (err) {
      toast.error('Could not load candidates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Function to reset the form to its initial state
  const resetForm = () => {
    setName('');
    setParty('');
    setFile(null);
    setEditingCandidate(null);
  };

  // Handler to set the form into "edit mode"
  const handleStartEdit = (candidate) => {
    setEditingCandidate(candidate);
    setName(candidate.name);
    setParty(candidate.party);
    setFile(null); // Clear any previously selected file
  };

  // Handler for form submission (handles both add and edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("party", party);
    if (file) {
      formData.append("image", file);
    }

    const toastId = toast.loading(editingCandidate ? 'Updating...' : 'Adding...');

    try {
      if (editingCandidate) {
        // Update existing candidate
        await api.put(`/candidates/${editingCandidate._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add new candidate
        await api.post('/candidates', formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      toast.success(editingCandidate ? 'Candidate updated!' : 'Candidate added!', { id: toastId });
      resetForm();
      fetchCandidates();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Operation failed', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    
    const toastId = toast.loading('Deleting...');
    try {
      await api.delete(`/candidates/${id}`);
      toast.success('Candidate deleted', { id: toastId });
      fetchCandidates();
    } catch (err) {
      toast.error('Delete failed', { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="glass p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">
          {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <ImageUploader 
              file={file}
              existingImage={editingCandidate?.image}
              onFileChange={setFile}
            />
            <div className="grid sm:grid-cols-2 gap-4 flex-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Candidate Name"
                className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white"
                required
              />
              <input
                value={party}
                onChange={(e) => setParty(e.target.value)}
                placeholder="Party Name (e.g., BJP)"
                className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white"
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
              {editingCandidate ? 'Save Changes' : 'Add Candidate'}
            </button>
            {editingCandidate && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-md bg-slate-600 text-white font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Current Parties</h3>
        {loading ? (
            <p className="text-center text-slate-400">Loading candidates...</p>
        ) : (
          <div className="space-y-3">
            {candidates.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-md">
                <div className="flex items-center gap-4">
                  <img
                    src={c.image || 'https://via.placeholder.com/150'} // Fallback image
                    alt={`${c.name} logo`}
                    className="w-12 h-12 rounded-full object-cover bg-slate-700"
                  />
                  <div>
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-sm text-slate-400">{c.party}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleStartEdit(c)} className="px-3 py-1 rounded-md bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700">Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}