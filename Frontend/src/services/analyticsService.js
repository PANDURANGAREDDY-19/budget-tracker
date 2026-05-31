import api, { isApiOffline } from './api.js'
import { analyticsData, departmentBudget } from '../data/mockData.js'

export const fetchBudgetAllocation = async () => {
  if (isApiOffline()) return analyticsData.budgetAllocation
  try {
    const { data } = await api.get('/analytics/budget-allocation')
    return data
  } catch (err) {
    return analyticsData.budgetAllocation
  }
}

export const fetchDepartmentExpense = async () => {
  if (isApiOffline()) return departmentBudget
  try {
    const { data } = await api.get('/departments')
    return data
  } catch (err) {
    return departmentBudget
  }
}

export const fetchMonthlySpending = async () => {
  if (isApiOffline()) return analyticsData.monthlySpending
  try {
    const { data } = await api.get('/analytics/monthly-spending')
    return data
  } catch (err) {
    return analyticsData.monthlySpending
  }
}

export const fetchProgressByMonth = async () => {
  return []
}

export const fetchStatusDistribution = async () => {
  if (isApiOffline()) return analyticsData.statusDistribution
  try {
    const { data } = await api.get('/analytics/status-distribution')
    return data
  } catch (err) {
    return analyticsData.statusDistribution
  }
}
