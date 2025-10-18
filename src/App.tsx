/**
 * App 根组件
 * 整合所有 Provider 和路由配置
 */

import { Suspense, useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { Spin } from 'antd'
import { ThemeProvider, QueryProvider, I18nProvider } from '@app/providers'
import { ErrorBoundary, routes } from '@app/routes'
import { initializeStores } from '@shared/stores'
import { usePerformanceMonitor } from '@shared/hooks/usePerformanceMonitor'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('common')
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spin size="large" tip={t('status.loading')} />
    </div>
  )
}

/**
 * 性能监控包装组件
 * 在 Router 内部调用 usePerformanceMonitor，确保可以访问 useLocation
 */
function PerformanceMonitorWrapper({ children }: { children: React.ReactNode }) {
  usePerformanceMonitor()
  return <>{children}</>
}

/**
 * App 根组件
 * 组件层级：ErrorBoundary > Providers > Router > PerformanceMonitor > Routes
 */
function App() {
  // 初始化所有 Stores（在应用启动时）
  useEffect(() => {
    initializeStores()
  }, [])

  return (
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider>
          <QueryProvider>
            <BrowserRouter>
              <PerformanceMonitorWrapper>
                <Suspense fallback={<LoadingFallback />}>
                  <AppRoutes />
                </Suspense>
              </PerformanceMonitorWrapper>
            </BrowserRouter>
          </QueryProvider>
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  )
}

export default App
