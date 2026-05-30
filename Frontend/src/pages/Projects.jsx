import React, { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { mockProjects } from '../data/mockData'

const Projects = () => {
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = mockProjects.filter((project) => {
    const matchesFilter = filter === 'All' || project.status === filter
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statuses = ['All', 'Planning', 'In Progress', 'Completed']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600 mt-2">Browse all public projects and their budgets</p>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No projects found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

export default Projects
