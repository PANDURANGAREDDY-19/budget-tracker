import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const BudgetChart = ({ data }) => {
  const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed']

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="budget"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BudgetChart
