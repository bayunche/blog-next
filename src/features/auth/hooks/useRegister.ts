/**
 * 注册 Hook
 * 使用 TanStack Query 实现注册逻辑
 */

import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { registerAPI } from '../api'
import type { RegisterRequest } from '../types'

/**
 * 注册 Hook 配置
 */
interface UseRegisterOptions {
  /** 注册成功回调 */
  onSuccess?: () => void
  /** 注册失败回调 */
  onError?: (error: Error) => void
}

/**
 * 注册 Hook
 * @param options 配置选项
 * @returns Mutation 对象
 */
export function useRegister(options?: UseRegisterOptions) {
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerAPI(data),

    onSuccess: (response) => {
      // 显示成功消息
      message.success(response.message || '注册成功！请登录')

      // 执行成功回调
      options?.onSuccess?.()
    },

    onError: (error: Error) => {
      // 显示错误消息
      message.error(error.message || '注册失败，请检查输入信息')

      // 执行失败回调
      options?.onError?.(error)
    },
  })
}

/**
 * 导出默认 Hook
 */
export default useRegister