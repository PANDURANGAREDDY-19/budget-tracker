import React from 'react'
import * as Icons from 'lucide-react'

const StatsCard = ({ title, value, change, icon }) => {
  const isPositive = change?.startsWith('+')
  const IconComponent = icon && Icons[icon] ? Icons[icon] : Icons.ChartPie
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
          <p className="text-4xl font-extrabold text-slate-900 mt-4">{formattedValue}</p>
          <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {change}
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-700 shadow-inner">
          <IconComponent className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
