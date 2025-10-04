/**
 * Axios 请求层配置
 * 包含请求/响应拦截器、请求去重、错误处理等功能
 */

import axios, { type AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { getToken, removeToken, encryptPassword } from '@shared/utils'

// 请求队列管理（用于请求去重）
const pendingRequests = new Map<string, AbortController>()

/**
 * 生成请求唯一键
 * @param config Axios 请求配置
 * @returns 请求的唯一标识
 */
const generateReqKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 添加请求到队列（用于请求去重）
 * @param config Axios 请求配置
 */
const addPendingRequest = (config: InternalAxiosRequestConfig): void => {
  const reqKey = generateReqKey(config)

  // 如果已存在相同请求，取消之前的请求
  if (pendingRequests.has(reqKey)) {
    const controller = pendingRequests.get(reqKey)!
    controller.abort('重复请求已取消')
  }

  // 创建新的 AbortController
  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(reqKey, controller)
}

/**
 * 从队列中移除请求
 * @param config Axios 请求配置
 */
const removePendingRequest = (config: InternalAxiosRequestConfig): void => {
  const reqKey = generateReqKey(config)
  pendingRequests.delete(reqKey)
}

/**
 * 创建 Axios 实例
 * @returns Axios 实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 15000,
    withCredentials: true,
    validateStatus: (status) => status < 500,
  })

  // ==================== 请求拦截器 ====================
  instance.interceptors.request.use(
    (config) => {
      // 1. Token 处理
      const token = getToken()
      if (token) {
        config.headers['Authorization'] = token
      }

      // 2. 请求去重（添加到队列）
      addPendingRequest(config)

      // 3. 密码加密（统一处理）
      if (config.data?.password) {
        config.data.password = encryptPassword(config.data.password)
      }

      // 4. 添加时间戳防止缓存（GET 请求）
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }
      }

      return config
    },
    (error: AxiosError) => {
      message.error('请求配置错误')
      return Promise.reject(error)
    }
  )

  // ==================== 响应拦截器 ====================
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 清除请求记录
      removePendingRequest(response.config as InternalAxiosRequestConfig)

      // 处理响应数据
      const { code, data, message: msg } = response.data

      // 成功响应（code 为 200 或 0）
      if (code === 200 || code === 0) {
        return data
      }

      // 业务错误（非 200/0 的情况）
      message.warning(msg || '请求失败')
      return Promise.reject(new Error(msg || '请求失败'))
    },
    (error: AxiosError) => {
      // 清除请求记录
      if (error.config) {
        removePendingRequest(error.config as InternalAxiosRequestConfig)
      }

      // 取消请求不报错（用户主动取消或请求去重导致）
      if (error.code === 'ERR_CANCELED') {
        console.log('Request cancelled:', error.message)
        return Promise.reject(error)
      }

      // 网络错误处理
      if (!error.response) {
        message.error('网络错误，请检查网络连接')
        return Promise.reject(error)
      }

      // HTTP 错误处理
      const { status, data } = error.response
      const errorMessage = (data as any)?.message

      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录')
          removeToken()
          // 延迟跳转，确保 message 显示
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
          break

        case 403:
          message.error('没有权限访问该资源')
          break

        case 404:
          message.error('请求的资源不存在')
          break

        case 429:
          message.error('请求太频繁，请稍后再试')
          break

        case 500:
          message.error('服务器内部错误')
          break

        case 502:
          message.error('网关错误')
          break

        case 503:
          message.error('服务暂时不可用')
          break

        case 504:
          message.error('网关超时')
          break

        default:
          message.error(errorMessage || `请求失败: ${status}`)
      }

      return Promise.reject(error)
    }
  )

  return instance
}

// ==================== 导出 ====================

/**
 * 导出 Axios 实例
 */
export const request = createAxiosInstance()

/**
 * 取消所有待处理的请求
 */
export const cancelAllRequests = (): void => {
  pendingRequests.forEach((controller) => {
    controller.abort('批量取消请求')
  })
  pendingRequests.clear()
}

/**
 * 取消特定 URL 的请求
 * @param url 要取消的请求 URL（支持部分匹配）
 */
export const cancelRequest = (url: string): void => {
  pendingRequests.forEach((controller, key) => {
    if (key.includes(url)) {
      controller.abort(`取消请求: ${url}`)
      pendingRequests.delete(key)
    }
  })
}

/**
 * 获取当前待处理的请求数量
 * @returns 待处理请求数量
 */
export const getPendingRequestsCount = (): number => {
  return pendingRequests.size
}

/**
 * 导出默认实例（方便直接使用）
 */
export default request