import api, { isApiOffline } from './api.js'
import { mockStats } from '../data/mockData.js'

export const fetchDashboardOverview = async () => {
  if (isApiOffline()) {
    return {
      total_projects: mockStats.totals.totalProjects,
      active_projects: mockStats.totals.activeProjects,
      completed_projects: mockStats.totals.completedProjects,
      delayed_projects: mockStats.totals.delayedProjects
    }
  }

  try {
    const { data } = await api.get('/dashboard/overview')
    return data
  } catch (err) {
    return {
      total_projects: mockStats.totals.totalProjects,
      active_projects: mockStats.totals.activeProjects,
      completed_projects: mockStats.totals.completedProjects,
      delayed_projects: mockStats.totals.delayedProjects
    }
  }
}
