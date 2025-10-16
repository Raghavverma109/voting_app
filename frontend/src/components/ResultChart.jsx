// src/components/ResultChart.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// A consistent color palette for the charts
const COLORS = ['#60a5fa', '#34d399', '#fcd34d', '#a78bfa', '#fb7185', '#fda4af'];

// A custom tooltip for a richer hover experience on both charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.value / data.totalVotes) * 100).toFixed(1);

    return (
      <div className="glass p-3 border border-slate-700 rounded-md shadow-lg">
        <p className="font-bold text-white">{label || data.name}</p>
        <p className="text-sm text-slate-300">Party: {data.party}</p>
        <p className="text-sm text-emerald-400">Votes: {data.value.toLocaleString()}</p>
        <p className="text-xs text-slate-400">{percentage}% of total</p>
      </div>
    );
  }
  return null;
};

// Function to render custom percentage labels on the pie chart slices
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 5) return null; // Hide labels for very small slices to avoid clutter

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ResultChart({ data }) {
  // ✅ FIX 1: Add a guard clause to prevent rendering with no data
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500">
        Not enough data to display charts.
      </div>
    );
  }

  // ✅ FIX 2: Correctly calculate totalVotes using 'voteCount'
  const totalVotes = data.reduce((sum, entry) => sum + entry.voteCount, 0);
  
  // ✅ FIX 3: Prepare data for recharts using 'voteCount' and a consistent 'value' key
  const chartData = data.map(d => ({
    name: d.name,
    party: d.party,
    value: d.voteCount, // Use 'value' as the standard key for recharts
    totalVotes: totalVotes, // Pass total for percentage calculation in tooltip
  }));

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Bar Chart for Vote Count */}
      <div className="glass p-4 h-96">
        <h4 className="font-semibold mb-4 text-white">Votes by Candidate</h4>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
            <Bar dataKey="value" name="Votes"> {/* Use the 'value' key */}
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart (Donut) for Vote Share */}
      <div className="glass p-4 h-96 relative">
        <h4 className="font-semibold mb-2 text-white">Vote Share</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value" // Use the 'value' key
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={60}
              labelLine={false}
              label={renderCustomizedLabel}
              stroke="#1e293b"
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ fontSize: '14px', bottom: '0px' }} />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-3xl font-bold text-white">{totalVotes.toLocaleString()}</span>
          <span className="block text-sm text-slate-400">Total Votes</span>
        </div>
      </div>
    </div>
  );
}