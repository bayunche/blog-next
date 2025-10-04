/**
 * 错误边界组件
 * 捕获组件树中的 JavaScript 错误，记录错误并显示降级 UI
 */

import { Component, type ReactNode } from 'react'
import { Button, Result } from 'antd'

interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode
  /** 自定义降级 UI */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  /** 是否有错误 */
  hasError: boolean
  /** 错误对象 */
  error: Error | null
  /** 错误信息 */
  errorInfo: string | null
}

/**
 * ErrorBoundary 组件
 * 提供错误捕获和降级 UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * 从错误中派生状态
   * @param error 错误对象
   * @returns 新状态
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  /**
   * 错误捕获钩子
   * @param error 错误对象
   * @param errorInfo 错误信息
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误到控制台
    console.error('Error caught by ErrorBoundary:', error, errorInfo)

    // 保存错误信息到状态
    this.setState({
      errorInfo: errorInfo.componentStack || null,
    })

    // 生产环境下发送错误到监控服务
    if (import.meta.env.PROD) {
      // TODO: 集成错误监控服务（如 Sentry）
      // sendErrorToMonitoringService(error, errorInfo)
    }
  }

  /**
   * 重置错误状态并刷新页面
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    // 返回首页
    window.location.href = '/'
  }

  /**
   * 尝试重新渲染
   */
  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { fallback, children } = this.props

    if (hasError) {
      // 如果提供了自定义降级 UI，则使用它
      if (fallback) {
        return fallback
      }

      // 默认错误 UI
      return (
        <div style={{ padding: '2rem' }}>
          <Result
            status="500"
            title="页面出错了"
            subTitle={
              import.meta.env.DEV
                ? error?.message
                : '抱歉，页面出现了一些问题，请稍后再试'
            }
            extra={[
              <Button type="primary" key="reset" onClick={this.handleReset}>
                返回首页
              </Button>,
              <Button key="retry" onClick={this.handleRetry}>
                重试
              </Button>,
            ]}
          />

          {/* 开发环境下显示详细错误信息 */}
          {import.meta.env.DEV && errorInfo && (
            <details style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                查看错误堆栈
              </summary>
              <pre
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '400px',
                }}
              >
                {error?.stack}
                {'\n\n'}
                {errorInfo}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return children
  }
}

/**
 * 导出默认组件
 */
export default ErrorBoundary