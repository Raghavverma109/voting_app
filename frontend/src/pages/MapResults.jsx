// src/pages/MapResults.jsx
import React, { useState, useEffect } from 'react';
import { getElections, getElectionMapResults } from '../api/electionService';
import ElectionMapView from '../components/ElectionMapView';
import MapLegend from '../components/MapLegend';
import toast from 'react-hot-toast';

const MapResults = () => {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState('');
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all elections to populate the dropdown
        const fetchAllElections = async () => {
            try {
                const { data } = await getElections();
                setElections(data);
                if (data.length > 0) {
                    setSelectedElection(data[0]._id); // Select the first election by default
                }
            } catch (error) {
                toast.error('Failed to load elections.');
            }
        };
        fetchAllElections();
    }, []);

    useEffect(() => {
        // Fetch map data whenever the selected election changes
        console.log("Selected Election Changed:", selectedElection);
        if (selectedElection) {
            const fetchMapData = async () => {
                setLoading(true);
                try {
                    const { data } = await getElectionMapResults(selectedElection);
                    console.log("Backend Map Data Received:", data);
                    setMapData(data);
                } catch (error) {
                    toast.error('Failed to load map data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchMapData();
        }
    }, [selectedElection]);

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Geographical Results</h1>
                <select
                    value={selectedElection}
                    onChange={(e) => setSelectedElection(e.target.value)}
                    className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white"
                >
                    {elections.map(e => (
                        <option key={e._id} value={e._id}>{e.title}</option>
                    ))}
                </select>
            </div>

            <div className="glass p-4 rounded-lg relative">
                {loading ? (
                    <p className="text-center text-slate-400">Loading Map Data...</p>
                ) : (
                    <>
                        <ElectionMapView mapData={mapData} />
                        <MapLegend /> {/* 👈 3. Render the legend component here */}
                    </>
                )}
            </div>
        </div>
    );
};

export default MapResults;