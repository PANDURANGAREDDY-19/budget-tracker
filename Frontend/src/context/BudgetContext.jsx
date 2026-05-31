import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchBudgetAllocation } from '../services/analyticsService.js'
import { fetchMonthlySpending } from '../services/analyticsService.js'
import { analyticsData, departmentBudget } from '../data/mockData'

const BudgetContext = createContext()

export const BudgetProvider = ({ children }) => {
  const [departmentData, setDepartmentData] = useState(departmentBudget)
  const [monthlyData, setMonthlyData] = useState(analyticsData.monthlySpending)
  const [importedDataMessage, setImportedDataMessage] = useState('')

  // Load imported data from localStorage on mount
  useEffect(() => {
    const savedImportedData = localStorage.getItem('budgetTrackerImportedData')
    if (savedImportedData) {
      try {
        const importedData = JSON.parse(savedImportedData)
        if (importedData.departments) {
          setDepartmentData(importedData.departments)
        }
        if (importedData.monthlySpending) {
          setMonthlyData(importedData.monthlySpending)
        }
        setImportedDataMessage('Budget data imported from Admin Dashboard')
        // Clear message after 5 seconds
        const timer = setTimeout(() => setImportedDataMessage(''), 5000)
        return () => clearTimeout(timer)
      } catch (error) {
        console.error('Error loading imported data:', error)
      }
    }
  }, [])

  // Try to load data from backend API (non-blocking, fallback to bundled mock data)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const depts = await fetchBudgetAllocation()
        const months = await fetchMonthlySpending()
        if (!mounted) return
        if (depts && depts.length) setDepartmentData(depts)
        if (months && months.length) setMonthlyData(months)
      } catch (err) {
        // leave mock data in place
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const importBudgetData = (data) => {
    try {
      if (data.departments) {
        setDepartmentData(data.departments)
      }
      if (data.monthlySpending) {
        setMonthlyData(data.monthlySpending)
      }
      setImportedDataMessage('✓ Budget data imported successfully!')
      // Clear message after 5 seconds
      setTimeout(() => setImportedDataMessage(''), 5000)
      return true
    } catch (error) {
      console.error('Error importing budget data:', error)
      return false
    }
  }

  const value = {
    departmentData,
    monthlyData,
    importedDataMessage,
    importBudgetData,
    setImportedDataMessage
  }

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  )
}

export const useBudgetContext = () => {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useBudgetContext must be used within BudgetProvider')
  }
  return context
}
