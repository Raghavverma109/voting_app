import React, { useState, useEffect } from 'react';
import { addElection, getCandidates } from '../api/electionService';
import toast from 'react-hot-toast';

const AddElectionModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [dateOfElection, setDateOfElection] = useState('');
  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  // Fetch all available candidates when the modal opens
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await getCandidates();
        setAllCandidates(data);
      } catch (error) {
        toast.error('Could not load candidates.');
      }
    };
    fetchCandidates();
  }, []);

  const handleCandidateToggle = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCandidates.length < 2) {
      return toast.error('Please select at least two candidates.');
    }
    try {
      await addElection({ title, dateOfElection, candidateIds: selectedCandidates });
      toast.success('Election created successfully!');
      onSuccess(); // This will refresh the list AND close the modal
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to create election.');
    }
  };

  // This should ONLY return the modal structure with a form inside.
  // Nothing else.
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Election</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="px-3 py-2 rounded-md border bg-slate-700 border-slate-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Election Title"
            required
          />
          <input
            type="date"
            className="px-3 py-2 rounded-md border bg-slate-700 border-slate-600"
            value={dateOfElection}
            onChange={(e) => setDateOfElection(e.target.value)}
            required
          />

          <h3 className="font-semibold mt-2">Select Candidates:</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-slate-600 rounded-md">
            {allCandidates.map((candidate) => (
              <div key={candidate._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={candidate._id}
                  checked={selectedCandidates.includes(candidate._id)}
                  onChange={() => handleCandidateToggle(candidate._id)}
                />
                <label htmlFor={candidate._id}>{candidate.name} ({candidate.party})</label>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-md bg-emerald-600 text-white"
            >
              Create Election
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-md bg-slate-500 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddElectionModal;