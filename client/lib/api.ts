import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
          })
          
          const { accessToken } = response.data
          localStorage.setItem('accessToken', accessToken)
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`
          return api.request(error.config)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/'
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api

