import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const EditElectionModal = ({ election, onClose, onUpdate }) => {
  // Pre-fill state with the existing election data
  const [title, setTitle] = useState(election.title);
  const [dateOfElection, setDateOfElection] = useState(
    new Date(election.dateOfElection).toISOString().split('T')[0] // Format for date input
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(election._id, { title, dateOfElection });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Election</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="px-3 py-2 rounded-md border bg-slate-700 border-slate-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            className="px-3 py-2 rounded-md border bg-slate-700 border-slate-600"
            value={dateOfElection}
            onChange={(e) => setDateOfElection(e.target.value)}
            required
          />
          <div className="flex gap-4 mt-4">
            <button type="submit" className="flex-1 px-4 py-2 rounded-md bg-sky-600 text-white">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-md bg-slate-500 text-white">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditElectionModal;