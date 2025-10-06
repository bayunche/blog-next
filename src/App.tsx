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
import { usePerformanceMonitor } from '@shared/hooks/usePerformanceMonitor'

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

  // 前端性能监控（Web Vitals + FPS + 内存 + 导航）
  usePerformanceMonitor()

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