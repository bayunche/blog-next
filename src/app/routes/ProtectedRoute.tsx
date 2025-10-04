/**
 * 路由守卫组件
 * 保护需要认证或特定角色的路由
 */

import { Navigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { getUserInfo, isAdmin } from '@shared/utils'

interface ProtectedRouteProps {
  /** 需要的角色 */
  requiredRole?: 'admin' | 'user'
  /** 重定向路径 */
  redirectTo?: string
  /** 加载状态 */
  loading?: boolean
}

/**
 * ProtectedRoute 组件
 * 检查用户认证状态和权限
 */
export function ProtectedRoute({
  requiredRole = 'user',
  redirectTo = '/login',
  loading = false,
}: ProtectedRouteProps) {
  // 显示加载状态
  if (loading) {
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

  // 获取用户信息
  const userInfo = getUserInfo()

  // 未登录，重定向到登录页
  if (!userInfo) {
    return <Navigate to={redirectTo} replace />
  }

  // 需要管理员权限但用户不是管理员
  if (requiredRole === 'admin' && !isAdmin()) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: '您没有权限访问该页面' }}
      />
    )
  }

  // 通过验证，渲染子路由
  return <Outlet />
}

/**
 * 导出默认组件
 */
export default ProtectedRoute