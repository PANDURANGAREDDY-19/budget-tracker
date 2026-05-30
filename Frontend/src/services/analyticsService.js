import { budgetAllocationChart, departmentExpenseChart, monthlySpendingChart, progressAreaChart, statusDistribution } from '../data/mockData.js'

export const fetchBudgetAllocation = async () => {
  return Promise.resolve(budgetAllocationChart)
}

export const fetchDepartmentExpense = async () => {
  return Promise.resolve(departmentExpenseChart)
}

export const fetchMonthlySpending = async () => {
  return Promise.resolve(monthlySpendingChart)
}

export const fetchProgressByMonth = async () => {
  return Promise.resolve(progressAreaChart)
}

export const fetchStatusDistribution = async () => {
  return Promise.resolve(statusDistribution)
}
