/**
 * GitHub OAuth 回调页面
 * 处理 GitHub 登录后的重定向
 */

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Result } from 'antd'
import { useGithubAuth } from '../hooks'

/**
 * GitHub 回调页面组件
 */
export function GithubCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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
        <Spin size="large" tip="正在使用 GitHub 登录..." />
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
          title="GitHub 登录失败"
          subTitle={error.message || '请稍后重试'}
          extra={
            <a href="/" style={{ color: 'var(--primary-color)' }}>
              返回首页
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