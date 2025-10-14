// src/components/ResultChart.jsx
import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#60a5fa', '#34d399', '#fda4af', '#fcd34d', '#a78bfa', '#fb7185']

export default function ResultChart({ data }) {
  // data format: [{ name, votes }]
  const totalVotes = data.reduce((s, d) => s + (d.votes || 0), 0)
  const pieData = data.map((d) => ({ name: d.name, value: d.votes || 0, party: d.party }))

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass p-4 h-90">
        <h4 className="font-semibold mb-2">Votes by Candidate</h4>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="votes" fill="#3b82f6">
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                  name={entry.party}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass p-4 h-90">
        <h4 className="font-semibold mb-2">Vote Share</h4>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="party"
              outerRadius={80}
              label={({ value }) => value} // Show votes by the arrow
            >
              {pieData.map((entry, idx) => (
                <Cell key={entry.party} fill={COLORS[idx % COLORS.length]} name={entry.party} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-2 text-sm text-slate-500">Total votes: {totalVotes}</div>
      </div>
    </div>
  )
}
