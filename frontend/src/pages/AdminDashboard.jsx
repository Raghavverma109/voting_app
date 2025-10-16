import React from 'react';
import { Link } from 'react-router-dom';
// Optional: Create a simple CSS file for styling the cards if needed
// import './AdminDashboard.css'; 

const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Panel</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card for Managing Parties */}
        <Link 
          to="/admin/parties" 
          className="glass p-6 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-white">Manage Parties</h2>
          <p className="text-slate-400 mt-2">View, create, edit, and delete candidate parties.</p>
        </Link>
        
        {/* Card for Managing Elections */}
        <Link 
          to="/admin/elections" 
          className="glass p-6 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-white">Manage Elections</h2>
          <p className="text-slate-400 mt-2">Create new elections and view ongoing or past results.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;