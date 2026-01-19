import axios from 'axios'
import { useAuthStore } from '@/shared/store/authStore'

// Create Axios instance
const request = axios.create({
    baseURL: typeof window === 'undefined'
        ? (process.env.INTERNAL_API_URL || 'http://localhost:6060')
        : '/api',
    timeout: 10000,
})

// Request interceptor
request.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout()
            // Optional: redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default request
