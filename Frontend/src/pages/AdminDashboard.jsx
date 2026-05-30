import React, { useState } from 'react'
import ProjectTable from '../components/ProjectTable'
import { mockProjects } from '../data/mockData'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage projects, budgets, and system settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['projects', 'budgets', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Projects Management</h2>
            <button className="btn btn-primary">+ Add Project</button>
          </div>
          <ProjectTable projects={mockProjects} />
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Budget Allocation</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Department</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Allocated</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Spent</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Remaining</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{project.department}</td>
                      <td className="px-4 py-3 text-gray-900">${(project.budget / 1000000).toFixed(1)}M</td>
                      <td className="px-4 py-3 text-gray-900">${(project.spent / 1000000).toFixed(1)}M</td>
                      <td className="px-4 py-3 text-gray-900">${((project.budget - project.spent) / 1000000).toFixed(1)}M</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">System Name</label>
                  <input
                    type="text"
                    defaultValue="Public Budget Tracker"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Notifications</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  <span className="ml-2">Enable email notifications</span>
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Export Data
                </button>
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Import Data
                </button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
