import React from 'react';

// The component now accepts an `onEdit` prop
const ElectionList = ({ elections, onDelete, onEdit }) => {
  if (!elections || elections.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No elections found. Please add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="px-6 py-3">Election Title</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Participants</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {elections.map((election) => (
            <tr key={election._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
              <td className="px-6 py-4 font-medium text-white">{election.title}</td>
              <td className="px-6 py-4">{new Date(election.dateOfElection).toLocaleDateString()}</td>
              <td className="px-6 py-4">{election.parties.length}</td>
              <td className="px-6 py-4 text-right flex gap-2 justify-end">
                {/* --- EDIT BUTTON ADDED --- */}
                <button 
                  onClick={() => onEdit(election)} // Pass the whole election object
                  className="px-3 py-1 rounded-md bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(election._id)} 
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectionList;