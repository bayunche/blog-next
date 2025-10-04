/**
 * 管理后台侧边菜单
 */

import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminMenuItems, getMenuOpenKeys } from '../config/menu'
import type { MenuItem } from '../types'

const menuOpenKeys = getMenuOpenKeys(adminMenuItems)

/**
 * 管理后台侧边栏组件
 */
export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  /**
   * 渲染菜单项
   */
  function renderMenuItem(item: MenuItem): React.ReactElement | null {
    if (item.hidden) return null

    // 有子菜单
    if (item.children && item.children.length > 0) {
      return {
        key: item.path,
        icon: item.icon,
        label: item.name,
        children: item.children.map((child) => renderMenuItem(child)).filter(Boolean),
      } as any
    }

    // 无子菜单
    return {
      key: item.path,
      icon: item.icon,
      label: item.name,
      onClick: () => navigate(item.path),
    } as any
  }

  // 生成菜单项
  const menuItems = adminMenuItems.map((item) => renderMenuItem(item)).filter(Boolean)

  // 根据当前路径获取应该展开的菜单
  const target = menuOpenKeys.find((d) => d.pathname === location.pathname)
  const openKeys = target ? [target.openKey] : []

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={openKeys}
      items={menuItems}
      style={{
        height: '100%',
        borderRight: 0,
      }}
    />
  )
}

export default AdminSidebar
