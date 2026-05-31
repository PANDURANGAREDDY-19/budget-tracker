import api from './api.js'

export const fetchBudgetAllocation = async () => {
  const { data } = await api.get('/analytics/budget-allocation')
  return data
}

export const fetchDepartmentExpense = async () => {
  const { data } = await api.get('/departments')
  return data
}

export const fetchMonthlySpending = async () => {
  const { data } = await api.get('/analytics/monthly-spending')
  return data
}

export const fetchProgressByMonth = async () => {
  // The backend currently stores monthly spending but not progress metrics.
  return []
}

export const fetchStatusDistribution = async () => {
  const { data } = await api.get('/analytics/status-distribution')
  return data
}
