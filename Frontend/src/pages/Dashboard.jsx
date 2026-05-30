import React from 'react'
import StatsCard from '../components/StatsCard'
import ProjectCard from '../components/ProjectCard'
import BudgetChart from '../components/BudgetChart'
import ProjectTable from '../components/ProjectTable'
import { mockProjects, mockStats, analyticsData } from '../data/mockData'

const Dashboard = () => {
  const chartData = analyticsData.budgetAllocation.map((item) => ({ name: item.name, budget: item.value }))

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Welcome back! Here's your civic budget overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.overview.map((stat, index) => (
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
      <ProjectTable projects={mockProjects.slice(0, 5)} />

      {/* Featured Projects */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
