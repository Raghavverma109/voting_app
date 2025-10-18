import React from 'react';
import { partyColors } from '../utils/mapConfig';

const MapLegend = () => {
  // We don't want to show the "default" color in the legend
  const legendItems = Object.entries(partyColors).filter(([key]) => key !== 'default');

  return (
    // This uses absolute positioning to float on top of the map
    <div className="absolute bottom-5 right-5 z-[1000] glass p-3 rounded-md border border-slate-700 shadow-lg">
      <h4 className="font-bold text-sm text-white mb-2">Winning Party</h4>
      <div className="space-y-2">
        {legendItems.map(([party, color]) => (
          <div key={party} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-xs text-slate-300">{party}</span>
          </div>
        ))}
         {/* You can add a key for states with no votes */}
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#334155' }}></div>
            <span className="text-xs text-slate-300">No Votes</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;