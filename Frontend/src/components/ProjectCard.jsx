import React from 'react'
import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const progressPercentage = (project.spent / project.budget) * 100

  const statusColor = {
    'In Progress': 'bg-amber-100 text-amber-700 border border-amber-300',
    'Completed': 'bg-emerald-100 text-emerald-700 border border-emerald-300',
    'Planning': 'bg-blue-100 text-blue-700 border border-blue-300'
  }

  return (
    <Link to={`/app/projects/${project.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusColor[project.status] || 'bg-gray-100'}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-5 line-clamp-2">{project.description}</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">Budget Progress</span>
                <span className="font-bold text-blue-600">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-700 h-2.5 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Budget</p>
                <p className="text-lg font-bold text-gray-900 mt-1">${(project.budget / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Spent</p>
                <p className="text-lg font-bold text-blue-600 mt-1">${(project.spent / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
