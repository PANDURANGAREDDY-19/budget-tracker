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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error?.response?.data || error)
  }
)

export default api
