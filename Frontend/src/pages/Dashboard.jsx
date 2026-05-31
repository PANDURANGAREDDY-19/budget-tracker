import React, { useEffect, useState } from 'react'
import StatsCard from '../components/StatsCard'
import ProjectCard from '../components/ProjectCard'
import BudgetChart from '../components/BudgetChart'
import ProjectTable from '../components/ProjectTable'
import { fetchDashboardOverview } from '../services/dashboardService.js'
import { fetchProjects } from '../services/projectsService.js'
import { fetchBudgetAllocation } from '../services/analyticsService.js'

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [projects, setProjects] = useState([])
  const [budgetAlloc, setBudgetAlloc] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [o, p, b] = await Promise.all([
          fetchDashboardOverview(),
          fetchProjects(),
          fetchBudgetAllocation()
        ])
        if (!mounted) return
        setOverview(o || {})
        setProjects(Array.isArray(p) ? p : [])
        setBudgetAlloc(Array.isArray(b) ? b : [])
      } catch (err) {
        if (!mounted) return
        console.warn('Dashboard API load failed, falling back to defaults', err)
        setOverview({})
        setProjects([])
        setBudgetAlloc([])
        setErrorMessage('Unable to load some dashboard analytics from the backend. Using offline data instead.')
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const chartData = (budgetAlloc || []).map((item) => ({
    name: item.name,
    budget: item.budget ?? item.value ?? item.allocated ?? 0
  }))

  const stats = overview
    ? [
        { title: 'Total Projects', value: overview.total_projects ?? overview.totalProjects ?? 0 },
        { title: 'Active Projects', value: overview.active_projects ?? overview.activeProjects ?? 0 },
        { title: 'Completed Projects', value: overview.completed_projects ?? overview.completedProjects ?? 0 },
        { title: 'Delayed Projects', value: overview.delayed_projects ?? overview.delayedProjects ?? 0 }
      ]
    : []

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="section-title">Public Civic Dashboard</h1>
        <p className="section-subtitle">Open access to budget data, project analytics, and civic chat support.</p>
      </div>

      {errorMessage && <p className="text-sm text-amber-600">{errorMessage}</p>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon || 'ChartPie'}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart data={chartData} />
      </div>

      {/* Projects Table */}
      <ProjectTable projects={projects.slice(0, 5)} />

      {/* Featured Projects */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
