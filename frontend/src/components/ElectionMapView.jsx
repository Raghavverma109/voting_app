// src/components/ElectionMapView.jsx  <-- Note the new filename

import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import indiaStates from '../assets/indian-states.json';

const partyColors = {
    BJP: '#FF9933',
    INC: '#19AA23',
    AAP: '#0072B0',
    default: '#64748b'
};

// Note the new component name
const ElectionMapView = ({ mapData }) => {
    const mapCenter = [22.5937, 78.9629];
    const mapZoom = 4.5;

    const onEachState = (state, layer) => {
        // ✅ FIX: Use the 'name' property from your new GeoJSON file
        const stateName = state.properties.name; 
        const result = mapData.find(d => d.state === stateName);
        
        const color = result ? (partyColors[result.winningParty] || partyColors.default) : '#334155';
        layer.options.fillColor = color;
        layer.options.fillOpacity = 0.7;
        layer.options.color = '#e2e8f0';
        layer.options.weight = 1;

        let popupContent = `<b>${stateName}</b><br/>`;
        if (result) {
            popupContent += `<b>Winning Party: ${result.winningParty}</b><br/><hr>`;
            result.results.forEach(r => {
                popupContent += `${r.party}: ${r.votes.toLocaleString()} votes<br/>`;
            });
        } else {
            popupContent += 'No votes recorded.';
        }
        layer.bindPopup(popupContent);
    };

    return (
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '70vh', width: '100%' }} className="rounded-lg">
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeoJSON 
                data={indiaStates.features}
                onEachFeature={onEachState} 
            />
        </MapContainer>
    );
};

export default ElectionMapView; // <-- Note the new component name