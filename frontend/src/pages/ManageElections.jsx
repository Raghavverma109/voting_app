// src/pages/ManageElections.jsx

import React, { useState, useEffect } from 'react';
import { getElections, deleteElection, updateElection } from '../api/electionService';
import ElectionList from '../components/ElectionList';
import AddElectionModal from '../components/AddElectionModal';
import EditElectionModal from '../components/EditElectionModal';
import toast from 'react-hot-toast';

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState(null);

  // ✅ COMPLETE THIS FUNCTION
  const fetchElections = async () => {
    try {
      // It's good practice to set loading to true even for refetches
      setLoading(true);
      const { data } = await getElections();
      setElections(data);
    } catch (error) {
      toast.error('Failed to fetch elections.');
    } finally {
      // This is the crucial part that stops the loading screen
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  // ✅ COMPLETE THIS FUNCTION
  const handleDelete = async (electionId) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      try {
        await deleteElection(electionId);
        toast.success('Election deleted successfully!');
        fetchElections(); // Refresh the list
      } catch (error) {
        toast.error('Failed to delete election.');
      }
    }
  };

  const handleStartEdit = (election) => {
    setEditingElection(election);
  };

  const handleUpdate = async (electionId, updatedData) => {
    try {
      await updateElection(electionId, updatedData);
      toast.success('Election updated successfully!');
      setEditingElection(null);
      fetchElections();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update election.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manage Elections</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          + Add New Election
        </button>
      </div>

      <div className="glass p-4 rounded-lg">
        {loading ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : (
          <ElectionList 
            elections={elections} 
            onDelete={handleDelete} 
            onEdit={handleStartEdit}
          />
        )}
      </div>

      {isAddModalOpen && (
        <AddElectionModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchElections();
            setIsAddModalOpen(false);
          }}
        />
      )}
      
      {editingElection && (
        <EditElectionModal
          election={editingElection}
          onClose={() => setEditingElection(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ManageElections;