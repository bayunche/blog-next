/**
 * GitHub OAuth 回调页面
 * 处理 GitHub 登录后的重定向
 */

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Result } from 'antd'
import { useGithubAuth } from '../hooks'
import { useTranslation } from 'react-i18next'

/**
 * GitHub 回调页面组件
 */
export function GithubCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation('auth')

  // GitHub OAuth Hook
  const { handleGithubCallback, isProcessing, error } = useGithubAuth({
    onSuccess: () => {
      // 登录成功，跳转到首页
      navigate('/', { replace: true })
    },
  })

  useEffect(() => {
    // 获取 URL 参数
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      // 没有授权码，跳转到首页
      navigate('/', { replace: true })
      return
    }

    // 处理 GitHub 回调
    handleGithubCallback(code, state || undefined)
  }, [searchParams, handleGithubCallback, navigate])

  // 显示加载状态
  if (isProcessing) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip={t('github.callbackLoading')} />
      </div>
    )
  }

  // 显示错误状态
  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '2rem',
        }}
      >
        <Result
          status="error"
          title={t('github.errorTitle')}
          subTitle={error.message || t('github.errorDefault')}
          extra={
            <a href="/" style={{ color: 'var(--primary-color)' }}>
              {t('github.backHome')}
            </a>
          }
        />
      </div>
    )
  }

  return null
}

/**
 * 导出默认组件
 */
export default GithubCallbackPage
