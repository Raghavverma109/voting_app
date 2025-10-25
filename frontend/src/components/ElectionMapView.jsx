// src/components/ElectionMapView.jsx

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// ❌ DELETE this static import: import indiaStates from '../assets/indian-states.json';
import { partyColors } from '../utils/mapConfig';

const ElectionMapView = ({ mapData }) => {
    const mapCenter = [22.5937, 78.9629];
    const mapZoom = 4.5;

    // ✅ NEW: State to hold the GeoJSON data once loaded
    const [geoJsonData, setGeoJsonData] = useState(null);
    // ✅ NEW: State to track loading of the GeoJSON file
    const [geoJsonLoading, setGeoJsonLoading] = useState(true);

    // ✅ NEW: useEffect hook to fetch the GeoJSON file
    useEffect(() => {
        const fetchGeoJson = async () => {
            try {
                // Fetch the file from the /public directory
                const response = await fetch('/indian-states.json'); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGeoJsonData(data); // Store the loaded data in state
            } catch (error) {
                console.error("Failed to load GeoJSON file:", error);
                // Optionally: show an error message to the user
            } finally {
                setGeoJsonLoading(false); // Stop loading regardless of success/failure
            }
        };

        fetchGeoJson();
    }, []); // Empty dependency array means this runs once when the component mounts

    const onEachState = (state, layer) => {
        // Use the correct property name ('st_nm')
        const stateName = state.properties.st_nm;

        const result = mapData.find(d =>
            d.state && stateName && d.state.trim().toLowerCase() === stateName.trim().toLowerCase()
        );

        const color = result ? (partyColors[result.winningParty] || partyColors.default) : '#334155';
        layer.options.fillColor = color;
        layer.options.fillOpacity = 0.7;
        layer.options.color = '#e2e8f0';
        layer.options.weight = 1;

        let popupContent = `<b>${stateName}</b><br/>`;
        if (result) {
            popupContent += `<b>Winning Party: ${result.winningParty}</b><br/><hr>`;
            result.results.forEach(r => {
                const partyName = Array.isArray(r.party) ? r.party[0] : r.party;
                popupContent += `${partyName}: ${r.votes.toLocaleString()} votes<br/>`;
            });
        } else {
            popupContent += 'No votes recorded.';
        }
        layer.bindPopup(popupContent);
    };

    // ✅ NEW: Show a loading message while the GeoJSON file is being fetched
    if (geoJsonLoading) {
        return (
            <div style={{ height: '70vh', width: '100%' }} className="rounded-lg flex items-center justify-center bg-slate-800">
                <p className="text-slate-400">Loading map boundaries...</p>
            </div>
        );
    }

    // ✅ NEW: Handle the case where GeoJSON failed to load
    if (!geoJsonData) {
        return (
             <div style={{ height: '70vh', width: '100%' }} className="rounded-lg flex items-center justify-center bg-slate-800">
                <p className="text-red-400">Error: Could not load map boundaries.</p>
            </div>
        );
    }

    // Only render the map once the GeoJSON data is available
    return (
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '70vh', width: '100%' }} className="rounded-lg">
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {/* ✅ Use the geoJsonData state here */}
            <GeoJSON
                data={geoJsonData.features}
                onEachFeature={onEachState}
            />
        </MapContainer>
    );
};

export default ElectionMapView;