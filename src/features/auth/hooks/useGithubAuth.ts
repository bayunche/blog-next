/**
 * GitHub OAuth Hook
 * 处理 GitHub 第三方登录逻辑
 */

import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useAuthStore } from '@shared/stores'
import { githubAuthCallbackAPI } from '../api'
import type { GithubCallbackParams } from '../types'
import { useTranslation } from 'react-i18next'

/**
 * GitHub OAuth Hook 配置
 */
interface UseGithubAuthOptions {
  /** 成功回调 */
  onSuccess?: () => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/**
 * GitHub OAuth Hook
 * @param options 配置选项
 */
export function useGithubAuth(options?: UseGithubAuthOptions) {
  const { setAuth } = useAuthStore()
  const { t } = useTranslation('auth')

  // GitHub 客户端 ID（从环境变量获取）
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID

  // 检查 GitHub OAuth 是否可用
  const isGithubAuthAvailable = Boolean(githubClientId)

  // GitHub 回调处理 Mutation
  const githubCallbackMutation = useMutation({
    mutationFn: (params: GithubCallbackParams) => githubAuthCallbackAPI(params),

    onSuccess: (response) => {
      // 保存用户信息和 Token
      setAuth(response.user, response.token)

      // 显示成功消息
      message.success(t('github.success'))

      // 执行成功回调
      options?.onSuccess?.()
    },

    onError: (error: Error) => {
      // 显示错误消息
      message.error(error.message || t('github.failure'))

      // 执行失败回调
      options?.onError?.(error)
    },
  })

  /**
   * 开始 GitHub OAuth 流程
   * 跳转到 GitHub 授权页面
   */
  const startGithubAuth = () => {
    if (!isGithubAuthAvailable) {
      message.warning(t('github.unavailableTitle'))
      return
    }

    // 生成随机 state 用于防止 CSRF 攻击
    const state = Math.random().toString(36).substring(2)

    // 保存 state 到 sessionStorage
    sessionStorage.setItem('github_oauth_state', state)

    // GitHub OAuth 授权 URL
    const redirectUri = `${window.location.origin}/github`
    const githubAuthUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${githubClientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=user:email` +
      `&state=${state}`

    // 跳转到 GitHub 授权页面
    window.location.href = githubAuthUrl
  }

  /**
   * 处理 GitHub OAuth 回调
   * @param code 授权码
   * @param state 状态码
   */
  const handleGithubCallback = (code: string, state?: string) => {
    // 验证 state（可选，增强安全性）
    const savedState = sessionStorage.getItem('github_oauth_state')
    if (state && state !== savedState) {
      message.error(t('github.stateError'))
      return
    }

    // 清除保存的 state
    sessionStorage.removeItem('github_oauth_state')

    // 调用回调 API
    githubCallbackMutation.mutate({ code, state })
  }

  return {
    /** GitHub OAuth 是否可用 */
    isGithubAuthAvailable,

    /** 开始 GitHub 登录 */
    startGithubAuth,

    /** 处理 GitHub 回调 */
    handleGithubCallback,

    /** 是否正在处理 GitHub 回调 */
    isProcessing: githubCallbackMutation.isPending,

    /** GitHub 认证错误 */
    error: githubCallbackMutation.error,
  }
}

/**
 * 导出默认 Hook
 */
export default useGithubAuth
