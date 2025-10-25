// src/api/axiosConfig.js
import axios from 'axios'

// ✅ Fix: use import.meta.env.VITE_* for environment variables
const baseURL = import.meta.env.VITE_Backend_URL || 'http://localhost:5000'
console.log("API Base URL:", baseURL)

// ✅ Create axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// ✅ Optional: handle expired token or errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized — possibly invalid or expired token.')
      // Optionally: redirect to login or clear token
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
