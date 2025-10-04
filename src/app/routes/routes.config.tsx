/**
 * 路由配置
 * 定义应用的所有路由规则
 */

import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

// ==================== 测试页面 ====================
import { TestPage } from '@shared/pages/TestPage'

// ==================== 认证页面 ====================
import { GithubCallbackPage } from '@features/auth'

// ==================== 文章页面 ====================
import {
  ArticleListPage,
  ArticleDetailPage,
  CategoriesPage,
  TagsPage,
  ArchivesPage,
} from '@features/article'

// ==================== 管理后台 ====================
import {
  AdminLayout,
  Dashboard,
  ArticleManager,
  ArticleEditor,
  UserManager,
  Monitor,
} from '@features/admin'

// ==================== 布局组件 ====================
import { WebLayout } from '@features/layout'

// ==================== 临时占位组件 ====================
// 用于开发阶段的临时页面
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>该页面正在开发中...</p>
  </div>
)

// ==================== 路由配置 ====================
export const routes: RouteObject[] = [
  // 根路径重定向到首页
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },

  // Web 前台路由
  {
    path: '/',
    element: <WebLayout />,
    children: [
      {
        path: 'home',
        element: <ArticleListPage />,
      },
      {
        path: 'article/:id',
        element: <ArticleDetailPage />,
      },
      {
        path: 'article/share/:uuid',
        element: <PlaceholderPage title="分享文章" />,
      },
      {
        path: 'archives',
        element: <ArchivesPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'categories/:name',
        element: <PlaceholderPage title="分类详情" />,
      },
      {
        path: 'tags',
        element: <TagsPage />,
      },
      {
        path: 'tags/:name',
        element: <PlaceholderPage title="标签详情" />,
      },
      {
        path: 'about',
        element: <PlaceholderPage title="关于" />,
      },
      {
        path: 'fragments',
        element: <PlaceholderPage title="碎片" />,
      },
    ],
  },

  // 管理后台路由（需要管理员权限）
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'article/manager',
            element: <ArticleManager />,
          },
          {
            path: 'article/add',
            element: <ArticleEditor />,
          },
          {
            path: 'article/edit/:id',
            element: <ArticleEditor />,
          },
          {
            path: 'article/graph',
            element: <PlaceholderPage title="文章图表" />,
          },
          {
            path: 'fragment/manager',
            element: <PlaceholderPage title="碎片管理" />,
          },
          {
            path: 'fragment/add',
            element: <PlaceholderPage title="添加碎片" />,
          },
          {
            path: 'user',
            element: <UserManager />,
          },
          {
            path: 'monitor',
            element: <Monitor />,
          },
        ],
      },
    ],
  },

  // 欢迎页面
  {
    path: '/welcome',
    element: <PlaceholderPage title="欢迎" />,
  },

  // GitHub 登录回调
  {
    path: '/github',
    element: <GithubCallbackPage />,
  },

  // 登录页面
  {
    path: '/login',
    element: <PlaceholderPage title="登录" />,
  },

  // 404 页面
  {
    path: '*',
    element: <PlaceholderPage title="404 - 页面未找到" />,
  },
]

/**
 * 路由元信息类型定义
 */
export interface RouteMeta {
  /** 路由标题 */
  title?: string
  /** 是否需要认证 */
  requiresAuth?: boolean
  /** 需要的角色 */
  requiredRole?: 'user' | 'admin'
  /** 图标 */
  icon?: string
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean
}