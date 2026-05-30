import React, { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { analyticsData, departmentBudget } from '../data/mockData'

const Analytics = () => {
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    setMonthlyData(analyticsData.monthlySpending.map((item) => ({
      month: item.month,
      budget: item.budgeted,
      spent: item.spent,
      projects: 8
    })))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed budget and project analytics.</p>
      </div>

      {/* Budget Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Budget Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="budget" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="spent" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Spending vs Budget */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Spending vs Budget Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="budget" fill="#2563eb" name="Budgeted" />
            <Bar dataKey="spent" fill="#f59e0b" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department-wise Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Departments by Budget</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentBudget} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Bar dataKey="allocated" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Budget Utilization Rate</h3>
          <div className="space-y-4">
            {mockBudgetData.map((dept, index) => {
              const utilization = (dept.spent / dept.budget) * 100
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-900">{dept.name}</span>
                    <span className="text-gray-600">{utilization.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Average Project Cost</p>
          <p className="text-3xl font-bold text-gray-900">$6.2M</p>
          <p className="text-sm text-gray-500 mt-2">Across all projects</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Budget Efficiency</p>
          <p className="text-3xl font-bold text-gray-900">87.3%</p>
          <p className="text-sm text-gray-500 mt-2">Planned vs Actual</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Project Completion</p>
          <p className="text-3xl font-bold text-gray-900">65%</p>
          <p className="text-sm text-gray-500 mt-2">Overall rate</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
