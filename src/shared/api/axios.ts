/**
 * Axios layer helpers：提供请求拦截、去重与统一错误提示
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { message } from 'antd'
import { encryptPassword, getToken, removeToken } from '@shared/utils'

const pendingRequests = new Map<string, AbortController>()

const generateReqKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

const addPendingRequest = (config: InternalAxiosRequestConfig): void => {
  const reqKey = generateReqKey(config)

  if (pendingRequests.has(reqKey)) {
    pendingRequests.get(reqKey)!.abort('Duplicated request cancelled')
  }

  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(reqKey, controller)
}

const removePendingRequest = (config: InternalAxiosRequestConfig): void => {
  const reqKey = generateReqKey(config)
  pendingRequests.delete(reqKey)
}

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 15000,
    withCredentials: true,
    validateStatus: status => status < 500,
  })

  instance.interceptors.request.use(
    config => {
      const token = getToken()
      if (token) {
        config.headers['Authorization'] = token
      }

      addPendingRequest(config)

      if (config.data?.password) {
        config.data.password = encryptPassword(config.data.password)
      }

      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }
      }

      return config
    },
    (error: AxiosError) => {
      message.error('Failed to prepare request')
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      removePendingRequest(response.config as InternalAxiosRequestConfig)

      const { code, data, message: msg } = response.data || {}

      if (code === 200 || code === 0) {
        return data
      }

      message.warning(msg || 'Request failed')
      return Promise.reject(new Error(msg || 'Request failed'))
    },
    (error: AxiosError) => {
      if (error.config) {
        removePendingRequest(error.config as InternalAxiosRequestConfig)
      }

      if (error.code === 'ERR_CANCELED') {
        console.log('Request cancelled:', error.message)
        return Promise.reject(error)
      }

      if (!error.response) {
        message.error('Network error, please check your connection')
        return Promise.reject(error)
      }

      const { status, data } = error.response
      const errorMessage = (data as { message?: string } | undefined)?.message

      switch (status) {
        case 401:
          message.error('Login expired, please sign in again')
          removeToken()
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
          break
        case 403:
          message.error('You have no permission to access this resource')
          break
        case 404:
          message.error('Resource not found')
          break
        case 429:
          message.error('Too many requests, please retry later')
          break
        case 500:
          message.error('Internal server error')
          break
        case 502:
          message.error('Bad gateway')
          break
        case 503:
          message.error('Service unavailable')
          break
        case 504:
          message.error('Gateway timeout')
          break
        default:
          message.error(errorMessage ?? 'Request failed: ' + status)
      }

      return Promise.reject(error)
    },
  )

  return instance
}

export const request = createAxiosInstance()

export const cancelAllRequests = (): void => {
  pendingRequests.forEach(controller => {
    controller.abort('Bulk cancel requests')
  })
  pendingRequests.clear()
}

export const cancelRequest = (url: string): void => {
  pendingRequests.forEach((controller, key) => {
    if (key.includes(url)) {
      controller.abort('Cancel request: ' + url)
      pendingRequests.delete(key)
    }
  })
}

export const getPendingRequestsCount = (): number => pendingRequests.size

export default request
