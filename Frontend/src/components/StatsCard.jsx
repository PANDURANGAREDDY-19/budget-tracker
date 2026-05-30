import React from 'react'

const StatsCard = ({ title, value, change, icon }) => {
  const isPositive = change?.startsWith('+')

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
          <p className={`text-sm font-semibold mt-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
        <div className="text-5xl bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl">{icon}</div>
      </div>
    </div>
  )
}

export default StatsCard
