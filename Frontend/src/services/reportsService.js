import api, { isApiOffline } from './api.js'
import { reportCategories, notifications as defaultNotifications } from '../data/mockData.js'

const OFFLINE_REPORTS_KEY = 'budgetTrackerOfflineReports'

const saveOfflineReport = (report) => {
  if (typeof window === 'undefined') {
    return { id: Date.now(), submittedAt: new Date().toISOString(), ...report }
  }

  try {
    const savedReports = JSON.parse(window.localStorage.getItem(OFFLINE_REPORTS_KEY) || '[]')
    const newReport = { id: Date.now(), submittedAt: new Date().toISOString(), ...report }
    const updated = [newReport, ...savedReports]
    window.localStorage.setItem(OFFLINE_REPORTS_KEY, JSON.stringify(updated))
    return newReport
  } catch (error) {
    return { id: Date.now(), submittedAt: new Date().toISOString(), ...report }
  }
}

export const fetchReportCategories = async () => {
  if (isApiOffline()) return reportCategories
  try {
    const { data } = await api.get('/report-categories')
    return data
  } catch (err) {
    return reportCategories
  }
}

export const fetchNotifications = async () => {
  if (isApiOffline()) return defaultNotifications
  try {
    const { data } = await api.get('/notifications')
    return data
  } catch (err) {
    return defaultNotifications
  }
}

export const submitReport = async (report) => {
  if (isApiOffline()) return saveOfflineReport(report)
  try {
    const { data } = await api.post('/reports', report)
    return data
  } catch (err) {
    return saveOfflineReport(report)
  }
}
