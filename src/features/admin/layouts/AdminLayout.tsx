/**
 * 管理后台主布局
 */

import { Layout, Breadcrumb } from 'antd'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'
import { adminMenuItems } from '../config/menu'
import type { MenuItem } from '../types'

const { Header, Sider, Content } = Layout

/**
 * 根据路径获取面包屑数据
 */
function getBreadcrumbItems(pathname: string, menuItems: MenuItem[]): Array<{ title: React.ReactNode }> {
  const items: Array<{ title: React.ReactNode }> = [
    {
      title: (
        <Link to="/admin">
          <HomeOutlined />
        </Link>
      ),
    },
  ]

  // 查找当前菜单项
  function findMenuItem(items: MenuItem[], path: string): MenuItem | null {
    for (const item of items) {
      if (item.path === path) {
        return item
      }
      if (item.children) {
        const found = findMenuItem(item.children, path)
        if (found) return found
      }
    }
    return null
  }

  // 查找父级菜单项
  function findParentMenuItem(items: MenuItem[], childPath: string): MenuItem | null {
    for (const item of items) {
      if (item.children) {
        const found = item.children.find((child) => child.path === childPath)
        if (found) return item
      }
    }
    return null
  }

  const currentItem = findMenuItem(menuItems, pathname)
  const parentItem = findParentMenuItem(menuItems, pathname)

  if (parentItem) {
    items.push({
      title: parentItem.name,
    })
  }

  if (currentItem) {
    items.push({
      title: currentItem.name,
    })
  }

  return items
}

/**
 * 管理后台布局组件
 */
export function AdminLayout() {
  const location = useLocation()
  const breadcrumbItems = getBreadcrumbItems(location.pathname, adminMenuItems)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          width: '100%',
          background: '#001529',
        }}
      >
        <AdminHeader />
      </Header>

      <Layout style={{ marginTop: 64 }}>
        {/* 侧边菜单 */}
        <Sider
          width={200}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}
        >
          <AdminSidebar />
        </Sider>

        {/* 内容区域 */}
        <Layout style={{ marginLeft: 200 }}>
          {/* 面包屑 */}
          <div
            style={{
              padding: '16px 24px',
              background: '#fff',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* 主内容 */}
          <Content
            style={{
              margin: '24px',
              padding: '24px',
              background: '#fff',
              minHeight: 'calc(100vh - 64px - 57px - 48px)',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
