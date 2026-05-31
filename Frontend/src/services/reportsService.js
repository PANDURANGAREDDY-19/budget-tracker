import api from './api.js'

export const fetchReportCategories = async () => {
  const { data } = await api.get('/report-categories')
  return data
}

export const fetchNotifications = async () => {
  const { data } = await api.get('/notifications')
  return data
}

export const submitReport = async (report) => {
  const { data } = await api.post('/reports', report)
  return data
}
