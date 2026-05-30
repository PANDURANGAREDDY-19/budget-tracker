import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error?.response?.data || error)
  }
)

export default api
