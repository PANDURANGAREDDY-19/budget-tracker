import { dashboardMetrics, budgetOverview, departmentStats, budgetAllocationChart, monthlySpendingChart, progressAreaChart, statusDistribution } from '../data/mockData.js'

export const fetchDashboardMetrics = async () => {
  return Promise.resolve({ metrics: dashboardMetrics, overview: budgetOverview })
}

export const fetchDepartmentStats = async () => {
  return Promise.resolve(departmentStats)
}

export const fetchBudgetAllocation = async () => {
  return Promise.resolve(budgetAllocationChart)
}

export const fetchMonthlySpending = async () => {
  return Promise.resolve(monthlySpendingChart)
}

export const fetchProgressArea = async () => {
  return Promise.resolve(progressAreaChart)
}

export const fetchStatusDistribution = async () => {
  return Promise.resolve(statusDistribution)
}
import { dashboardMetrics, budgetOverview, departmentStats, budgetAllocationChart, monthlySpendingChart, progressAreaChart, statusDistribution } from '../data/mockData.js'

export const fetchDashboardMetrics = async () => {
  return {
    metrics: dashboardMetrics,
    overview: budgetOverview,
    departmentStats,
    budgetAllocationChart,
    monthlySpendingChart,
    progressAreaChart,
    statusDistribution
  }
}

export const fetchDashboardSummary = async () => {
  return dashboardMetrics
}
