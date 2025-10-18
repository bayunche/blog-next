/**
 * 认证状态 Hook
 * 提供认证状态和操作的统一接口
 */

import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@shared/stores'
import { logoutAPI } from '../api'
import { useTranslation } from 'react-i18next'

/**
 * 认证 Hook
 * 提供认证状态和操作方法
 */
export function useAuth() {
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const { t } = useTranslation('auth')

  // 登出 Mutation
  const logoutMutation = useMutation({
    mutationFn: logoutAPI,

    onSuccess: () => {
      // 清除 Store 中的用户信息
      authStore.logout()

      // 显示成功消息
      message.success(t('message.logoutSuccess'))

      // 跳转到首页
      navigate('/', { replace: true })
    },

    onError: (error: Error) => {
      // 即使 API 调用失败，也清除本地状态
      authStore.logout()

      // 显示错误消息
      message.error(error.message || t('message.logoutFailed'))

      // 跳转到首页
      navigate('/', { replace: true })
    },
  })

  return {
    // ==================== 状态 ====================
    /** 当前用户信息 */
    user: authStore.user,

    /** 认证 Token */
    token: authStore.token,

    /** 加载状态 */
    loading: authStore.loading,

    /** 错误信息 */
    error: authStore.error,

    /** 是否已认证 */
    isAuthenticated: authStore.isAuthenticated(),

    /** 是否是管理员 */
    isAdmin: authStore.isAdmin(),

    // ==================== 操作 ====================
    /** 登出 */
    logout: () => logoutMutation.mutate(),

    /** 登出中 */
    isLoggingOut: logoutMutation.isPending,
  }
}

/**
 * 导出默认 Hook
 */
export default useAuth
