import axios from 'axios'

const baseURL = process.env.VITE_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api')

const API = axios.create({
  baseURL,
  timeout: 10000,
})

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API
