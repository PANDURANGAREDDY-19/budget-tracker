import axios from 'axios'
import { API_BASE_URL, ADMIN_TOKEN } from '../config/apiConfig.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

if (ADMIN_TOKEN) {
  api.defaults.headers.common['X-Admin-Token'] = ADMIN_TOKEN
}

export const isApiOffline = () => typeof window !== 'undefined' && window.__API_OFFLINE__ === true

api.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      window.__API_OFFLINE__ = false
    }
    return response
  },
  (error) => {
    if (error?.request && !error?.response) {
      if (typeof window !== 'undefined') {
        window.__API_OFFLINE__ = true
      }
    }
    return Promise.reject(error?.response?.data || error)
  }
)

export default api
