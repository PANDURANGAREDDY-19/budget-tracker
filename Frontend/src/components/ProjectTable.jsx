import React from 'react'
import { Link } from 'react-router-dom'

const ProjectTable = ({ projects }) => {
  const statusColor = {
    'In Progress': 'text-yellow-600',
    'Completed': 'text-green-600',
    'Planning': 'text-blue-600'
  }

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Project Name</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Department</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Budget</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Spent</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Progress</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link to={`/app/projects/${project.id}`} className="text-primary hover:underline">
                  {project.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600">{project.department}</td>
              <td className="px-4 py-3 text-gray-900">${(project.budget / 1000000).toFixed(1)}M</td>
              <td className="px-4 py-3 text-gray-900">${(project.spent / 1000000).toFixed(1)}M</td>
              <td className={`px-4 py-3 font-semibold ${statusColor[project.status] || 'text-gray-600'}`}>
                {project.status}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress ?? project.completion ?? 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{project.progress ?? project.completion ?? 0}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectTable
