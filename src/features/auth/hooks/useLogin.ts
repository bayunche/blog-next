/**
 * 登录 Hook
 * 使用 TanStack Query 实现登录逻辑
 */

import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useAuthStore } from '@shared/stores'
import { loginAPI } from '../api'
import type { LoginRequest } from '../types'
import { useTranslation } from 'react-i18next'

/**
 * 登录 Hook 配置
 */
interface UseLoginOptions {
  /** 登录成功回调 */
  onSuccess?: () => void
  /** 登录失败回调 */
  onError?: (error: Error) => void
}

/**
 * 登录 Hook
 * @param options 配置选项
 * @returns Mutation 对象
 */
export function useLogin(options?: UseLoginOptions) {
  const { setAuth } = useAuthStore()
  const { t } = useTranslation('auth')

  return useMutation({
    mutationFn: (data: LoginRequest) => loginAPI(data),

    onSuccess: (response) => {
      console.log('✅ 登录成功，响应数据:', response)

      // 保存用户信息和 Token 到 Store
      setAuth(response.user, response.token)

      // 显示成功消息
      message.success(t('message.loginSuccess'))

      // 执行成功回调
      options?.onSuccess?.()

      // 延迟刷新页面，让用户看到成功提示
      setTimeout(() => {
        window.location.reload()
      }, 500)
    },

    onError: (error: Error) => {
      console.error('❌ 登录失败:', error)

      // 显示错误消息
      message.error(error.message || t('message.loginFailed'))

      // 执行失败回调
      options?.onError?.(error)
    },
  })
}

/**
 * 导出默认 Hook
 */
export default useLogin
