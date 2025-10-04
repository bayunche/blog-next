/**
 * App 根组件
 * 整合所有 Provider 和路由配置
 */

import { Suspense, useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { Spin } from 'antd'
import { ThemeProvider, QueryProvider } from '@app/providers'
import { ErrorBoundary, routes } from '@app/routes'
import { initializeStores } from '@shared/stores'
import { usePerformance, type PerformanceMetrics } from '@shared/hooks'

/**
 * 路由容器组件
 * 使用 useRoutes 渲染路由配置
 */
function AppRoutes() {
  const element = useRoutes(routes)
  return element
}

/**
 * 加载组件
 * 在懒加载组件时显示
 */
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spin size="large" tip="加载中..." />
    </div>
  )
}

/**
 * App 根组件
 * 组件层级：ErrorBoundary > Providers > Router > Routes
 */
function App() {
  // 初始化所有 Stores（在应用启动时）
  useEffect(() => {
    initializeStores()
  }, [])

  // 性能监控（仅在生产环境启用）
  usePerformance(
    (metrics: PerformanceMetrics) => {
      if (import.meta.env.MODE === 'production') {
        // 生产环境：可以发送到监控服务
        console.log('Performance Metrics:', metrics)
        // TODO: 发送到监控服务（如 Sentry、DataDog 等）
        // sendToMonitoring(metrics)
      } else {
        // 开发环境：仅在控制台输出
        console.log('🚀 Performance Metrics:', {
          FCP: metrics.FCP ? `${metrics.FCP.toFixed(2)}ms` : 'N/A',
          LCP: metrics.LCP ? `${metrics.LCP.toFixed(2)}ms` : 'N/A',
          FID: metrics.FID ? `${metrics.FID.toFixed(2)}ms` : 'N/A',
          CLS: metrics.CLS ? metrics.CLS.toFixed(4) : 'N/A',
          TTFB: metrics.TTFB ? `${metrics.TTFB.toFixed(2)}ms` : 'N/A',
        })
      }
    },
    true // 启用性能监控
  )

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App