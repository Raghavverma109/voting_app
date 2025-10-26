// src/pages/AuditDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getElectionAudit } from '../api/electionService';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react'; // Import icons

const AuditDetail = () => {
    const { electionId } = useParams();
    const [auditData, setAuditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

     useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const { data } = await getElectionAudit(electionId);
                setAuditData(data);
            } catch (error) {
                toast.error('Failed to load audit details.');
            } finally {
                setLoading(false);
            }
        };
        fetchAuditData();
    }, [electionId]);   

    const filteredVoters = auditData?.voters.filter(voter =>
        voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.addharCardNumber.includes(searchTerm)
    );

    const formatAddress = (address) => {
        // Check if the address object exists and has the required fields
        if (!address || !address.city || !address.state || !address.pincode) {
            return 'N/A'; // Return 'Not Available' if data is incomplete
        }
        // Construct the formatted string
        return `${address.city}, ${address.state} - ${address.pincode}`;
    };
    
    const formatRelative = (relative) => {
        // Check if the relative object exists and has the required fields
        if (!relative || !relative.relationType || !relative.relativeName) {
            return 'N/A'; // Return 'Not Available' if data is incomplete
        }
        // Construct the formatted string (e.g., "S/O Anil Verma")
        return `${relative.relationType} ${relative.relativeName}`;
    };

    if (loading) return <p className="text-center text-slate-400 p-8">Loading Audit Details...</p>;
    if (!auditData) return <p className="text-center text-red-400 p-8">Could not load data.</p>;

    return (
        // Adjusted padding for responsiveness
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6"> 
            <Link to="/admin/history" className="text-sky-400 hover:underline text-sm">
                &larr; Back to History
            </Link>
            <div className="glass p-4 md:p-6 rounded-lg">
                {/* Header Section */}
                <div className="border-b border-slate-700 pb-4 mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{auditData.title}</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Held on: {new Date(auditData.dateOfElection).toLocaleDateString()} | Total Votes Cast: {auditData.totalVotes}
                    </p>
                </div>
                
                {/* Search Bar Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-lg md:text-xl font-bold text-white">Participating Voters List</h2>
                    <input
                        type="text"
                        placeholder="Search by name or Aadhar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 w-full md:w-1/3 rounded-md bg-slate-800 border border-slate-700 text-white"
                    />
                </div>

                {/* --- RESPONSIVE VOTER LIST --- */}
                {/* Table for Medium Screens and Up */}
                <div className="hidden md:block relative overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Voter</th>
                                <th scope="col" className="px-6 py-3">Aadhar Number</th>
                                <th scope="col" className="px-6 py-3">Relative</th>
                                <th scope="col" className="px-6 py-3">Sex</th>
                                <th scope="col" className="px-6 py-3">DOB</th>
                                <th scope="col" className="px-6 py-3">Address</th>
                                <th scope="col" className="px-6 py-3">Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVoters.map(voter => (
                                <tr key={voter._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <img src={voter.profilePhoto} alt={voter.name} className="w-10 h-10 rounded-full object-cover" />
                                        {voter.name}
                                    </td>
                                    <td className="px-6 py-4">{voter.addharCardNumber}</td>
                                    <td className="px-6 py-4">{formatRelative(voter.relative)}</td>
                                    <td className="px-6 py-4">{voter.sex}</td>
                                    <td className="px-6 py-4">{new Date(voter.dob).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{formatAddress(voter.address)}</td>
                                    <td className="px-6 py-4">
                                        {voter.isVerified ? 
                                            <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={14}/> Yes</span> : 
                                            <span className="text-red-400 font-bold flex items-center gap-1"><XCircle size={14}/> No</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card List for Small Screens */}
                <div className="md:hidden space-y-3 max-h-[60vh] overflow-y-auto">
                    {filteredVoters.map(voter => (
                        <div key={voter._id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            {/* --- Card Header --- */}
                            <div className="flex items-center gap-3 mb-3 border-b border-slate-700 pb-3">
                                <img src={voter.profilePhoto} alt={voter.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                                <div className="min-w-0"> {/* Allow text wrapping */}
                                    <p className="font-bold text-white text-lg truncate">{voter.name}</p>
                                    <p className="text-xs text-slate-400">Aadhar: {voter.addharCardNumber}</p>
                                </div>
                            </div>
                            {/* --- Card Body - Adjusted layout --- */}
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between">
                                    <strong className="text-slate-400 w-1/3">Relative:</strong> 
                                    <span className="text-white text-right w-2/3">{formatRelative(voter.relative)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <strong className="text-slate-400 w-1/3">Sex:</strong> 
                                    <span className="text-white text-right w-2/3">{voter.sex}</span>
                                </div>
                                <div className="flex justify-between">
                                    <strong className="text-slate-400 w-1/3">DOB:</strong> 
                                    <span className="text-white text-right w-2/3">{new Date(voter.dob).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <strong className="text-slate-400 w-1/3">Verified:</strong> 
                                    <div className="w-2/3 text-right">
                                        {voter.isVerified ? 
                                            <span className="text-emerald-400 font-bold inline-flex items-center gap-1"><CheckCircle size={14}/> Yes</span> : 
                                            <span className="text-red-400 font-bold inline-flex items-center gap-1"><XCircle size={14}/> No</span>}
                                    </div>
                                </div>
                                <div className="pt-1"> {/* Add slight top padding for address */}
                                    <strong className="text-slate-400 block mb-0.5">Address:</strong> 
                                    <span className="text-white block">{formatAddress(voter.address)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditDetail;