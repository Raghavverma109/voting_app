// src/components/ElectionMapView.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { partyColors } from '../utils/mapConfig';

// Helper hook to get window dimensions (optional but useful for complex adjustments)
function useWindowSize() {
  const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerHeight, window.innerWidth]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

const ElectionMapView = ({ mapData }) => {
    // --- Mobile Responsiveness Adjustments ---
    const [height, width] = useWindowSize();
    const isMobile = width < 768; // Tailwind's 'md' breakpoint

    // Adjust map height and zoom based on screen size
    const mapHeight = isMobile ? '50vh' : '70vh'; // Smaller height on mobile
    const mapZoom = isMobile ? 4.0 : 4.5;       // Slightly zoomed out on mobile
    const mapCenter = [22.5937, 78.9629]; // Center remains the same
    // --- End of Adjustments ---

    const [geoJsonData, setGeoJsonData] = useState(null);
    const [geoJsonLoading, setGeoJsonLoading] = useState(true);

    useEffect(() => {
        const fetchGeoJson = async () => {
            try {
                const response = await fetch('/indian-states.json'); 
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setGeoJsonData(data);
            } catch (error) {
                console.error("Failed to load GeoJSON file:", error);
            } finally {
                setGeoJsonLoading(false);
            }
        };
        fetchGeoJson();
    }, []);

    const onEachState = (state, layer) => {
        const stateName = state.properties.st_nm;
        const result = mapData.find(d =>
            d.state && stateName && d.state.trim().toLowerCase() === stateName.trim().toLowerCase()
        );

        const color = result ? (partyColors[result.winningParty] || partyColors.default) : '#334155';
        layer.options.fillColor = color;
        layer.options.fillOpacity = 0.7;
        layer.options.color = '#e2e8f0';
        layer.options.weight = 1;

        let popupContent = `<b style="color: white;">${stateName}</b><br/>`;
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

    if (geoJsonLoading) {
        return (
            <div style={{ height: mapHeight, width: '100%' }} className="rounded-lg flex items-center justify-center bg-slate-800">
                <p className="text-slate-400">Loading map boundaries...</p>
            </div>
        );
    }

    if (!geoJsonData) {
        return (
             <div style={{ height: mapHeight, width: '100%' }} className="rounded-lg flex items-center justify-center bg-slate-800">
                <p className="text-red-400">Error: Could not load map boundaries.</p>
            </div>
        );
    }

    return (
        // Use the dynamic mapHeight and mapZoom variables
        <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: mapHeight, width: '100%' }} 
            className="rounded-lg"
            // Ensure touch interactions are enabled (usually default)
            touchZoom={true} 
            scrollWheelZoom={true} // Allow scroll wheel zoom on desktop
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeoJSON
                data={geoJsonData.features}
                onEachFeature={onEachState}
            />
        </MapContainer>
    );
};

export default ElectionMapView;