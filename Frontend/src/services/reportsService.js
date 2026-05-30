import { reportCategories, notifications } from '../data/mockData.js'

export const fetchReportCategories = async () => {
  return Promise.resolve(reportCategories)
}

export const fetchNotifications = async () => {
  return Promise.resolve(notifications)
}

export const submitReport = async (report) => {
  return Promise.resolve({ success: true, report })
}
