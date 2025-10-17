// src/pages/AuditDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getElectionAudit } from '../api/electionService';
import toast from 'react-hot-toast';

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

    if (loading) return <p className="text-center text-slate-400 p-8">Loading Audit Details...</p>;
    if (!auditData) return <p className="text-center text-red-400 p-8">Could not load data.</p>;

    // Helper function to format the address object
    const formatAddress = (address) => {
        if (!address) return 'N/A';
        return `${address.city}, ${address.state} - ${address.pincode}`;
    };

    // Helper function to format the relative object
    const formatRelative = (relative) => {
        if (!relative) return 'N/A';
        return `${relative.relationType} ${relative.relativeName}`;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6"> {/* Increased width for more columns */}
            <Link to="/admin/history" className="text-sky-400 hover:underline">
                &larr; Back to History
            </Link>
            <div className="glass p-6 rounded-lg">
                <div className="border-b border-slate-700 pb-4 mb-4">
                    <h1 className="text-3xl font-bold text-white">{auditData.title}</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Held on: {new Date(auditData.dateOfElection).toLocaleDateString()} | Total Votes Cast: {auditData.totalVotes}
                    </p>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Participating Voters List</h2>
                    <input
                        type="text"
                        placeholder="Search by name or Aadhar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 w-1/3 rounded-md bg-slate-800 border border-slate-700 text-white"
                    />
                </div>

                <div className="relative overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Voter</th>
                                <th scope="col" className="px-6 py-3">Aadhar Number</th>
                                <th scope="col" className="px-6 py-3">Relative</th>
                                <th scope="col" className="px-6 py-3">Sex</th>
                                <th scope="col" className="px-6 py-3">Date of Birth</th>
                                <th scope="col" className="px-6 py-3">Address</th>
                                <th scope="col" className="px-6 py-3">Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVoters.map(voter => (
                                <tr key={voter._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <img
                                            src={voter.profilePhoto}
                                            alt={voter.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        {voter.name}
                                    </td>
                                    <td className="px-6 py-4">{voter.addharCardNumber}</td>
                                    <td className="px-6 py-4">{formatRelative(voter.relative)}</td>
                                    <td className="px-6 py-4">{voter.sex}</td>
                                    <td className="px-6 py-4">{new Date(voter.dob).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{formatAddress(voter.address)}</td>
                                    <td className="px-6 py-4">
                                        {voter.isVerified ? (
                                            <span className="text-emerald-400 font-bold">✔ Yes</span>
                                        ) : (
                                            <span className="text-red-400 font-bold">✘ No</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditDetail;