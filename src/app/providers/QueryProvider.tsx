/**
 * TanStack Query Provider
 * 管理应用的服务器状态和数据缓存
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { message } from 'antd'
import type { ReactNode } from 'react'
import { RETRY_CONFIG } from '@shared/config/queryConfig'

interface QueryProviderProps {
  children: ReactNode
}

/**
 * 全局错误处理函数
 * @param error 错误对象
 */
const queryErrorHandler = (error: unknown): void => {
  // 如果是 AxiosError，可以获取更详细的错误信息
  const errorMessage =
    error instanceof Error
      ? error.message
      : '请求失败，请稍后重试'

  // 使用 Ant Design 的 message 组件显示错误
  message.error(errorMessage)
}

/**
 * 重试逻辑
 * @param failureCount 失败次数
 * @param error 错误对象
 * @returns 是否继续重试
 */
const retryFunction = (failureCount: number, error: unknown): boolean => {
  // 不重试的状态码
  if (error instanceof Error) {
    const status = (error as any).response?.status
    if (RETRY_CONFIG.NO_RETRY_STATUS.includes(status)) {
      return false
    }
  }

  // 默认重试逻辑
  return failureCount < RETRY_CONFIG.DEFAULT_RETRY
}

/**
 * 重试延迟计算
 * 使用指数退避算法
 * @param attemptIndex 尝试次数（从0开始）
 * @returns 延迟时间（毫秒）
 */
const retryDelay = (attemptIndex: number): number => {
  return Math.min(1000 * 2 ** attemptIndex, RETRY_CONFIG.MAX_RETRY_DELAY)
}

/**
 * 创建 QueryClient 实例
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ==================== 缓存配置 ====================
      /** 数据新鲜时间（5分钟） */
      staleTime: 1000 * 60 * 5,
      /** 垃圾回收时间（30分钟） */
      gcTime: 1000 * 60 * 30,

      // ==================== 重试配置 ====================
      /** 重试函数 */
      retry: retryFunction,
      /** 重试延迟 */
      retryDelay: retryDelay,

      // ==================== 行为配置 ====================
      /** 窗口焦点时不自动重新获取（避免频繁请求） */
      refetchOnWindowFocus: false,
      /** 组件挂载时重新获取 */
      refetchOnMount: true,
      /** 断网重连时重新获取 */
      refetchOnReconnect: true,

      // ==================== 错误处理 ====================
      /** 全局错误处理函数 */
      throwOnError: false, // 不抛出错误，使用 onError 处理
    },
    mutations: {
      // ==================== 重试配置 ====================
      /** 突变操作重试1次 */
      retry: 1,
      /** 重试延迟 */
      retryDelay: retryDelay,

      // ==================== 错误处理 ====================
      throwOnError: false,
    },
  },
})

/**
 * QueryProvider 组件
 * 包装应用，提供 TanStack Query 功能
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 开发环境显示 React Query DevTools */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}

/**
 * 导出 QueryClient 实例（用于手动操作缓存）
 */
export { queryClient }