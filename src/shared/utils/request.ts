/**
 * Axios 请求实例
 * 统一的 HTTP 请求封装
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { getToken, removeToken } from './token'

/**
 * 创建 Axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    // 自动添加 Token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    const { data } = response

    // 如果后端返回的数据格式是 { code, data, message }
    if (data && typeof data === 'object' && 'code' in data) {
      // 成功
      if (data.code === 200 || data.code === 0) {
        return data.data
      }

      // 401 未授权 - 清除 Token 并跳转登录
      if (data.code === 401) {
        removeToken()
        message.error(data.message || '请先登录')
        // 可以在这里跳转到登录页
        // window.location.href = '/login'
        return Promise.reject(new Error(data.message || '未授权'))
      }

      // 其他错误
      const errorMessage = data.message || '请求失败'
      message.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }

    // 直接返回数据
    return data
  },
  (error) => {
    // 网络错误或其他错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          removeToken()
          message.error('请先登录')
          // window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问该资源')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error(error.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

/**
 * 封装的请求方法
 */
const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get(url, config)
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return instance.post(url, data, config)
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return instance.put(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete(url, config)
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return instance.patch(url, data, config)
  },
}

export default request
