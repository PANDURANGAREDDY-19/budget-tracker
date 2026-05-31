import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProjectById } from '../services/projectsService.js'
import BudgetChart from '../components/BudgetChart'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await fetchProjectById(id)
        if (mounted) setProject(data)
      } catch (err) {
        console.warn('Failed to load project', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [id])

  if (loading) {
    return <div className="card p-6">Loading...</div>
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/app/projects')}
          className="text-primary hover:underline"
        >
          ← Back to Projects
        </button>
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">Project not found</p>
        </div>
      </div>
    )
  }

  const budgetUsage = ((project.spent / project.budget) * 100).toFixed(1)
  const budgetRemaining = project.budget - project.spent

  const chartData = [
    { name: 'Spent', budget: project.spent },
    { name: 'Remaining', budget: budgetRemaining }
  ]

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/app/projects')}
        className="text-primary hover:underline"
      >
        ← Back to Projects
      </button>

      {/* Project Header */}
      <div className="card space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold text-white ${
            project.status === 'Completed' ? 'bg-green-600' :
            project.status === 'In Progress' ? 'bg-yellow-600' :
            'bg-blue-600'
          }`}>
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-gray-600 text-sm">Department</p>
            <p className="font-semibold text-gray-900">{project.department}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Category</p>
            <p className="font-semibold text-gray-900">{project.category}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Start Date</p>
            <p className="font-semibold text-gray-900">{project.startDate}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">End Date</p>
            <p className="font-semibold text-gray-900">{project.endDate}</p>
          </div>
        </div>
      </div>

      {/* Budget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Overview */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Budget Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Budget Usage</span>
                  <span className="font-semibold">{budgetUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${budgetUsage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Completion</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <BudgetChart data={chartData} />
        </div>

        {/* Budget Stats */}
        <div className="space-y-4">
          <div className="card bg-blue-50">
            <p className="text-gray-600 text-sm">Total Budget</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ${(project.budget / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="card bg-yellow-50">
            <p className="text-gray-600 text-sm">Amount Spent</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              ${(project.spent / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="card bg-green-50">
            <p className="text-gray-600 text-sm">Remaining Budget</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${(budgetRemaining / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
