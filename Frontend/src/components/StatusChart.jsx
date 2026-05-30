import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const StatusChart = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" stackId="a" fill="#2563eb" name="Budgeted" />
          <Bar dataKey="spent" stackId="a" fill="#f59e0b" name="Spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatusChart
