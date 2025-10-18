// src/components/ElectionMapView.jsx

import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import indiaStates from '../assets/indian-states.json';
import { partyColors } from '../utils/mapConfig';

const ElectionMapView = ({ mapData }) => {
    const mapCenter = [22.5937, 78.9629];
    const mapZoom = 4.5;


    const onEachState = (state, layer) => {
        // console.log(state.properties);
        // ✅ CORRECTED THIS LINE 👇
        // The console log confirms the property name is 'st_nm'.
        const stateName = state.properties.st_nm; 

        // console.log(`Comparing Map State: '${stateName}' with Backend States`);
        
        const result = mapData.find(d => 
        d.state.trim().toLowerCase() === stateName.trim().toLowerCase()
    );
        
        const color = result ? (partyColors[result.winningParty] || partyColors.default) : '#334155';
        layer.options.fillColor = color;
        layer.options.fillOpacity = 0.7;
        layer.options.color = '#e2e8f0';
        layer.options.weight = 1;

        // The stateName is now defined, so the popup will have a title.
        let popupContent = `<b>${stateName}</b><br/>`;
        if (result) {
            popupContent += `<b>Winning Party: ${result.winningParty}</b><br/><hr>`;
            result.results.forEach(r => {
                // Assuming r.party is an array, take the first element
                const partyName = Array.isArray(r.party) ? r.party[0] : r.party;
                popupContent += `${partyName}: ${r.votes.toLocaleString()} votes<br/>`;
            });
        } else {
            popupContent += 'No votes recorded.';
        }
        layer.bindPopup(popupContent);
    };

    return (
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '70vh', width: '100%' }} className="rounded-lg">
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeoJSON 
                data={indiaStates.features}
                onEachFeature={onEachState} 
            />
        </MapContainer>
    );
};

export default ElectionMapView;